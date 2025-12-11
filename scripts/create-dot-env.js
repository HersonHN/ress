// This script creates the .env file in order to pass environment variables to Vue.js

const Path = require('path');
const fs = require('fs');

const workingDir = Path.join(__dirname, '..');

init();

function init() {
  let output = parseVariables(['VITE_APP_FIREBASE']);
  let filename = Path.join(workingDir, '.env');
  saveOutput(output, filename);
}

function parseVariables(vars) {
  let lines = [];

  for (const key of vars) {
    let value = process.env[key] || '';
    let line = `${key}='${value}'`;

    if (!value) {
      console.warn('value for env variable', key, 'is not defined');
    }

    lines.push(line);
  }

  return lines.join('\n');
}
c;
function saveOutput(content, filename) {
  fs.writeFileSync(filename, content);
}
