plugins {
    kotlin("multiplatform") version "2.2.20"
}

repositories {
    mavenCentral()
}

kotlin {
    js {
        browser {
            commonWebpackConfig {
                outputFileName = "background.js"
                sourceMaps = false
            }
        }
        binaries.executable()
    }
}

val bundle = tasks.named("jsBrowserProductionWebpack")

// Assemble an unpacked extension for each browser into dist/<browser>
val assembleTasks = listOf("chrome", "firefox").map { browser ->
    tasks.register<Sync>("assemble${browser.replaceFirstChar(Char::uppercase)}") {
        group = "extension"
        description = "Assembles the unpacked $browser extension into dist/$browser"

        from(bundle) { include("background.js") }
        from("styles") { into("styles") }
        from("icons") { into("icons") }
        from("LICENSE", "README.md")
        from("manifest.$browser.json") { rename { "manifest.json" } }
        into(layout.projectDirectory.dir("dist/$browser"))
    }
}

tasks.named("build") { dependsOn(assembleTasks) }
tasks.named<Delete>("clean") { delete(layout.projectDirectory.dir("dist")) }

// Source archive for AMO reviewers, since the signed add-on contains bundled, minified Kotlin output
val firefoxSourceZip = tasks.register<Zip>("firefoxSourceZip") {
    group = "extension"
    description = "Packs the project source for upload to addons.mozilla.org"
    dependsOn("kotlinStoreYarnLock")

    from(layout.projectDirectory) {
        include(
            "src/**", "styles/**", "icons/**", "gradle/**", "kotlin-js-store/**",
            "gradlew", "gradlew.bat", "*.gradle.kts", "gradle.properties",
            "manifest.*.json", "LICENSE", "README.md", ".gitattributes",
        )
    }
    archiveFileName = "source.zip"
    destinationDirectory = layout.buildDirectory.dir("amo")
}

// Signs the Firefox build on AMO as an unlisted version of the public add-on and saves an installable .xpi.
// Each signed build gets a fourth version part (1.8.1 -> 1.8.1.N), so it never uses up a version number
// that a future public release needs, and the public listing is not changed.
abstract class SignFirefox @Inject constructor(
    private val exec: ExecOperations,
    private val fs: FileSystemOperations,
) : DefaultTask() {
    @get:InputDirectory abstract val extensionDir: DirectoryProperty
    @get:InputFile abstract val sourceZip: RegularFileProperty
    @get:Internal abstract val envFile: RegularFileProperty
    @get:Internal abstract val buildNumberFile: RegularFileProperty
    @get:Internal abstract val stagingDir: DirectoryProperty
    @get:Internal abstract val artifactsDir: DirectoryProperty

    @TaskAction
    fun sign() {
        val env = envFile.get().asFile.takeIf { it.exists() }?.readLines().orEmpty()
            .mapNotNull { line -> line.split("=", limit = 2).takeIf { it.size == 2 && !line.trimStart().startsWith("#") } }
            .associate { (key, value) -> key.trim() to value.trim() }
        val credentials = listOf("WEB_EXT_API_KEY", "WEB_EXT_API_SECRET").associateWith { env[it].orEmpty() }
        if (credentials.values.any { it.isEmpty() }) {
            throw GradleException("Set WEB_EXT_API_KEY and WEB_EXT_API_SECRET in .env (see .env.example)")
        }

        // Stage a copy so the version change never touches dist/ or the committed manifest
        val staging = stagingDir.get().asFile
        fs.sync { from(extensionDir); into(staging) }

        val counter = buildNumberFile.get().asFile
        val buildNumber = (counter.takeIf { it.exists() }?.readText()?.trim()?.toIntOrNull() ?: 0) + 1
        counter.writeText("$buildNumber\n")

        val manifest = staging.resolve("manifest.json")
        val versionPattern = Regex(""""version"\s*:\s*"([^"]+)"""")
        val baseVersion = versionPattern.find(manifest.readText())?.groupValues?.get(1)
            ?: throw GradleException("No version in ${manifest.path}")
        val version = "$baseVersion.$buildNumber"
        manifest.writeText(versionPattern.replaceFirst(manifest.readText(), "\"version\": \"$version\""))
        logger.lifecycle("Signing Firefox build $version as unlisted")

        val npx = if (System.getProperty("os.name").startsWith("Windows")) listOf("cmd", "/c", "npx") else listOf("npx")
        exec.exec {
            commandLine(npx + listOf(
                "--yes", "web-ext@10.7.0", "sign",
                "--channel", "unlisted",
                "--source-dir", staging.path,
                "--upload-source-code", sourceZip.get().asFile.path,
                "--artifacts-dir", artifactsDir.get().asFile.path,
            ))
            environment(credentials)
        }
        logger.lifecycle("Signed .xpi saved to ${artifactsDir.get().asFile.path}")
    }
}

tasks.register<SignFirefox>("signFirefox") {
    group = "extension"
    description = "Signs the Firefox build on AMO (unlisted) and saves an installable .xpi to web-ext-artifacts/"

    dependsOn("assembleFirefox")
    extensionDir = layout.projectDirectory.dir("dist/firefox")
    sourceZip = firefoxSourceZip.flatMap { it.archiveFile }
    envFile = layout.projectDirectory.file(".env")
    buildNumberFile = layout.projectDirectory.file(".amo-build-number")
    stagingDir = layout.buildDirectory.dir("amo/firefox")
    artifactsDir = layout.projectDirectory.dir("web-ext-artifacts")
}
