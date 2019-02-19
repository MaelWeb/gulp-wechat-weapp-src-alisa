const through = require('through2');
const gutil = require('gulp-util');
const alias = require('./alias');

module.exports = function (options) {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            return cb(new gutil.PluginError('gulp-path-alias', 'stream not supported'));
        }
        let content = file.contents.toString('utf8');
        content = alias(options, content, file.path);
        file.contents = Buffer.from(content);
        cb(null, file);
    });
};
