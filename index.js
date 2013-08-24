var _ = require('underscore');
var app = require('./app');
var lib = require('./lib');

module.exports = function (options) {
    _.defaults(options, {
        source : 'http://spmjs.org',
        port : 3000
    });

    // 初始化帐号配置和security token
    lib.auth.initAccountFile();
    lib.auth.generateSecurityToken();

    // 扫描缓存目录，准备 index.json
    console.log('Prepare repository...');
    lib.util.source = options.source;
    lib.util.prepareSpmCacheDir(function () {
        app.listen(options.port);
        console.log('Start spm-yuan on port ' + options.port);
    });

}