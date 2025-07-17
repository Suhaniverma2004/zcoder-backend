// utils/executeRunner.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const tempDir = path.join(__dirname, '../temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const executeRunner = async (code, language) => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    let filename;
    let command;

    if (language === 'cpp') {
      filename = `${jobId}.cpp`;
      const filepath = path.join(tempDir, filename);
      fs.writeFileSync(filepath, code);
      const outPath = path.join(tempDir, `${jobId}.out`);
      command = `g++ ${filepath} -o ${outPath} && ${outPath}`;
    } else if (language === 'py') {
      filename = `${jobId}.py`;
      const filepath = path.join(tempDir, filename);
      fs.writeFileSync(filepath, code);
      command = `python3 ${filepath}`;
    } else if (language === 'js') {
      filename = `${jobId}.js`;
      const filepath = path.join(tempDir, filename);
      fs.writeFileSync(filepath, code);
      command = `node ${filepath}`;
    } else {
      return reject({ error: 'Unsupported language' });
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error: stderr || error.message });
      } else {
        resolve(stdout);
      }
    });
  });
};

module.exports = executeRunner;
