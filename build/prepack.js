const fs = require('fs');
const package = require('../package.json');
const file = './package.json';
const backup = `${file}.build`;


// Backup source file
fs.renameSync(file, backup);

// Delete keys which are not needed in release package
package.releasePackageOmit.forEach((value) => delete package[value]);

// Write changes to package
fs.writeFileSync(file, JSON.stringify(package, null, '\t'));
