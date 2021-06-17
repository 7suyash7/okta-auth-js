const fs = require('fs');
const globby = require('globby');
const path = require('path');

const bannerSourcePath = path.join(__dirname, 'license-template');
const files = globby.sync(path.join(__dirname, '..','{lib/**/*.{js,ts},polyfill/**/*.{js,ts},test/**/*.{js,ts},samples/**/*.{js,ts},build/dist/*.js}'));
const bannerSource = fs.readFileSync(bannerSourcePath).toString();
const copyrightRegex = /(Copyright \(c\) )([0-9]+)-?([0-9]+)?/;

files.forEach(file => {
  if (file.includes('node_modules')) {
    return;
  }

  const contents = fs.readFileSync(file).toString();
  const match = contents.match(copyrightRegex);
  if (!match) {
    return fs.writeFileSync(file, bannerSource + '\n\n' + contents);
  }
});
