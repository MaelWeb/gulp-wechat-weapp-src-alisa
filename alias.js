const path = require('path');
const cssAliasses = require('css-aliases');

// js
const REQUIRE_REGEX = /require\(['"](.*?)['"]\)/g;
const JS_IMPORT_FROM = /from\s+['"](.*?)['"]/g;
const JS_IMPORT = /import\s+['"](.*?)['"]/g;
// wxml
const SRC_REGEX = /src=['"](.*?)['"]/g;

let keysPattern;
let opt;
let filePath;

function setKeysPatten(options) {
    options = options || {};
    keysPattern = keysPattern || new RegExp(`^(${Object.keys(options).join('|')})`);
}

function replaceCallback(match, subMatch) {
    if (keysPattern.test(subMatch)) {
        const indexEnd = subMatch.indexOf('/') === -1 ? subMatch.length : subMatch.indexOf('/');
        const key = subMatch.substring(0, indexEnd);
        if (!opt[key]) {
            return match;
        }
        const url = path.join(opt[key], subMatch.slice(indexEnd));
        return match.replace(
            subMatch,
            path.relative(filePath, url).replace(/\\/g, '/').replace(/^\.\.\//, '')
        );
    } else {
        return match;
    }
}


module.exports = function alias(options, content, _filePath) {
    opt = options = options || {};
    filePath = _filePath;
    setKeysPatten(options);
    switch (path.extname(_filePath)) {
        case '.js':
        case '.wxs':
        case '.ts':
            content = content.replace(JS_IMPORT_FROM, replaceCallback);
            content = content.replace(JS_IMPORT, replaceCallback);
            content = content.replace(REQUIRE_REGEX, replaceCallback);
            break;
        case '.wxml':
            content = content.replace(SRC_REGEX, replaceCallback);
            break;
        case '.styl':
        case '.stylus':
        case '.less':
        case '.sass':
        case '.scss':
        case '.css':
        case '.wxss':
            content = cssAliasses(content, _filePath, options);
            break;
        default:
            break;
    }
    return content;
};
