// This script creates the .env file in order to pass environment variables to Vue.js

const Path = require('path');
const fs = require('fs');

const workingDir = Path.join(__dirname, '..');


init();

function init() {
  let output = parseVariables([
    'VUE_APP_GOOGLE_ANALYTICS',
    'VUE_APP_FIREBASE'
  ]);
  let filename = Path.join(workingDir, '.env');
  saveOutput(output, filename);
}

function parseVariables(vars) {
  let lines = [];

  for (const key of vars) {
    // if (key.indexOf('VUE_APP') == 0 || key.indexOf('FIREBASE')) {
      let value = process.env[key] || '';
      // value = value.replace(/"/g, '\\\"');
      let line = `${key}='${value}'`;

      if (!value) {
        console.warn('value for env variable', key, 'is not defined');
      }

      lines.push(line);
    // }
  }

  return lines.join('\n');
}

function saveOutput(content, filename) {
  fs.writeFileSync(filename, content);
}