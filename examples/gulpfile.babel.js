const {
    src,
    dest,
    series
} = require('gulp')
const Less = require('gulp-less')
const Path = require('path')
const Alias = require('../index')
const getAliasFileManager = require('less-import-aliases');

function _join(dirname) {
    return Path.join(__dirname, './src', dirname)
}

const DEST = Path.join(__dirname, './dist')

// 路径别名配置
const aliasConfig = {
    Variable: _join('/variable.less'),
    Mixin: _join('/mixin.less'),
    TEST_A: _join('/testa/'),
    TEST_B: _join('/testa/testb/'),
}

function less() {
    return src('src/index.less')
        .pipe(Alias(aliasConfig))
        .pipe(Less({
            plugins: [new getAliasFileManager({
                aliases: {
                    TEST_A: __dirname + '/src/testa/',
                    TEST_B: __dirname + '/src/testa/testb/'
                }
            })]
        }))
        .pipe(dest(DEST))
}


exports.default = series(less);