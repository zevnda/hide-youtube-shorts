import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function deleteDirectoryRecursive(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file: string) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirectoryRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}

function copyRecursive(src: string, dest: string): void {
    if (!fs.existsSync(src)) return;

    const stats = fs.statSync(src);

    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const files = fs.readdirSync(src);

        files.forEach((file: string) => {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);

            copyRecursive(srcPath, destPath);
        });
    }
    else if (stats.isFile()) {
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.copyFileSync(src, dest);
    }
}

function buildExtension(): void {
    const sourceDir = path.resolve(__dirname, '..');
    const distDir = path.resolve(sourceDir, 'dist');
    const chromeDir = path.resolve(distDir, 'chrome');
    const firefoxDir = path.resolve(distDir, 'firefox');

    if (fs.existsSync(distDir)) {
        deleteDirectoryRecursive(distDir);
    }

    fs.mkdirSync(distDir);
    fs.mkdirSync(chromeDir);
    fs.mkdirSync(firefoxDir);

    const copyItems: string[] = [
        'styles',
        'icons',
        'LICENSE',
        'README.md'
    ];

    // Copy compiled JS files
    const compiledFiles = [
        { src: 'build/background.js', dest: 'background.js' },
        { src: 'build/content.js', dest: 'content.js' }
    ];

    copyItems.forEach(item => {
        const srcPath = path.resolve(sourceDir, item);
        const chromeDestPath = path.resolve(chromeDir, item);
        const firefoxDestPath = path.resolve(firefoxDir, item);

        copyRecursive(srcPath, chromeDestPath);
        copyRecursive(srcPath, firefoxDestPath);
    });

    compiledFiles.forEach(({ src, dest }) => {
        const srcPath = path.resolve(sourceDir, src);
        if (fs.existsSync(srcPath)) {
            const chromeDestPath = path.resolve(chromeDir, dest);
            const firefoxDestPath = path.resolve(firefoxDir, dest);
            
            fs.copyFileSync(srcPath, chromeDestPath);
            fs.copyFileSync(srcPath, firefoxDestPath);
        }
    });

    const chromeManifestSrc = path.resolve(sourceDir, 'manifest.chrome.json');
    const chromeManifestDest = path.resolve(chromeDir, 'manifest.json');
    fs.copyFileSync(chromeManifestSrc, chromeManifestDest);

    const firefoxManifestSrc = path.resolve(sourceDir, 'manifest.firefox.json');
    if (fs.existsSync(firefoxManifestSrc)) {
        const firefoxManifestDest = path.resolve(firefoxDir, 'manifest.json');
        fs.copyFileSync(firefoxManifestSrc, firefoxManifestDest);
    }

    console.log('Building directories completed successfully!');
}

buildExtension();
