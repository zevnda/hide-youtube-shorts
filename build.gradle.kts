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
