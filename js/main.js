const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the scripts to run in sequence
const scripts = [
    './eventGenerator.js',
    './convertToRegex.js',
    './serviceGenerator.js'
];

// Function to run a script
function runScript(scriptPath) {
    try {
        const fullPath = path.join(__dirname, scriptPath);
        console.log(`Running script: ${fullPath}`);
        execSync(`node ${fullPath}`, { stdio: 'inherit' });
        console.log(`Successfully ran script: ${fullPath}`);
    } catch (error) {
        console.error(`Error running script: ${scriptPath}`, error);
        process.exit(1); // Exit the process if any script fails
    }
}

// Function to watch JSON files for changes
function watchJSONFiles() {
    const jsonFiles = ['consumer.json', 'anonymized_events.json', 'eventPatterns.json', 'eventNames.json', 'servicePatterns.json'];

    jsonFiles.forEach(jsonFile => {
        const filePath = path.join(__dirname, '../json', jsonFile);
        fs.watchFile(filePath, (curr, prev) => {
            if (curr.mtime !== prev.mtime) {
                console.log(`${jsonFile} has changed. Rerunning main.js...`);
                runMain();
            }
        });
    });
}

// Function to run main.js
function runMain() {
    console.log('Running main.js...');
    scripts.forEach(runScript);
    console.log('All scripts ran successfully.');
}

// Initial run of main.js
runMain();

// Watch JSON files for changes
watchJSONFiles();
