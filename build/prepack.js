const fs = require('fs');
const package = require('../package.json');

// Backup source file
fs.renameSync('./package.json', './package.json.build');

// Delete keys which are not needed in release package
package.releasePackageOmit.forEach((value) => delete package[value]);

// Write changes to package
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
