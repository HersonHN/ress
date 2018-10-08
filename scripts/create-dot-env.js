// This script creates the .env file in order to pass environment variables to Vue.js


const Path = require('path');
const fs = require('fs');

const workingDir = Path.join(__dirname, '..');
const config = require( Path.join(workingDir, 'now.json') );

init();

function init() {
  let output = parseVariables(config.env);
  let filename = Path.join(workingDir, '.env');
  saveOutput(output, filename);
}

function parseVariables(hash) {
  let lines = [];

  for (const key in hash) {
    const value = process.env[key];
    let line = `${key}="${value}"`;
    lines.push(line);
  }

  return lines.join('\n');
}

function saveOutput(content, filename) {
  fs.writeFileSync(filename, content);
}