const { execSync } = require('child_process');
const { rimraf } = require('rimraf');
const path = require('path');


const build = () => {
    try {
        // Remove build directory
        rimraf.sync("./dist")
        console.log('✔ Cleaned build directory.');

        // Lint Code

        // Compile TypeScript
        execSync('tsc --project ./tsconfig.build.json', { stdio: 'inherit' });
        console.log('✔ TypeScript compilation completed.');

        // Copy files from .tmp/src to dist
        execSync(`ncp "./.tmp/src" "./dist"`, { stdio: 'inherit' });
        console.log('✔ Files copied from .tmp/src to dist.');

        // Remove the temporary directory
        rimraf.sync('./.tmp');
        console.log('✔ Temporary directory removed.');

        console.log("✔ Build Completed")
        console.log("\n")
    } catch (error) {
        console.error('Build process failed:', error.message);
        process.exit(1);
    }
};


build();