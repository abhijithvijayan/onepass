/* eslint-disable no-console */
/* eslint-disable-next-line import/no-extraneous-dependencies */
const fs = require('fs-extra');

const updateBackgroundFile = buildPath => {
    const backgroundJS = `${buildPath}/background.js`;
    const assetManifest = `${buildPath}/asset-manifest.json`;
    // Parse asset-manifest.json
    const { files } = JSON.parse(fs.readFileSync(assetManifest, 'utf8'));

    // Initial sample placeholder
    const jsPlaceholder = "const jsLocation = 'static/js/bundle.js';";
    const cssPlaceholder = 'const cssLocation = null;';

    // Get values from asset-manifest.json & replace if item exist
    const jsLocation = `const jsLocation = ${files['main.js'] !== undefined ? `".${files['main.js']}";` : 'null;'}`;
    const cssLocation = `const cssLocation = ${files['main.css'] !== undefined ? `".${files['main.css']}";` : 'null;'}`;

    let backgroundContents = fs.readFileSync(backgroundJS, 'utf8');
    // Replace with values from asset-manifest.json
    backgroundContents = backgroundContents.replace(jsPlaceholder, jsLocation);
    backgroundContents = backgroundContents.replace(cssPlaceholder, cssLocation);

    // Write back the corrected script
    fs.writeFile(backgroundJS, backgroundContents, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('background.js updated.');
    });
};

module.exports = {
    updateBackgroundFile,
};

if (require.main === module) {
    const buildPath = './build';
    updateBackgroundFile(buildPath);
}
