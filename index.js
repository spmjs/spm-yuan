var cluster = require('cluster');
var os = require('os');
var _ = require('underscore');
var app = require('./app');
var lib = require('./lib');

exports = module.exports = function (options) {
    _.defaults(options, {
        source : 'http://spmjs.org',
        port: 3000,
        workerNum : os.cpus().length
    });
    var port = options.port;
    var workerNum = options.workerNum;
    var workers = {};

    if (cluster.isMaster) {
        initEnv(options, function () {
            console.log('Start Server on port ' + port + ' with ' + workerNum + ' workers.');

            cluster.on('death', function (worker) {
                delete worker[worker.pid];
                worker = cluster.fork();
                workers[worker.pid] = worker;
            });

            for (var i = 0; i < workerNum; i++) {
                var worker = cluster.fork();
                workers[worker.pid] = worker;
            }
        });
    } else {
        var app = require('./app');
        app.listen(port);

        process.on('SIGTERM', function () {
            for (var pid in workers) {
                process.kill(pid);
            }
            process.exit(0);
        });

    }
};

// 初始化环境
function initEnv(options, callback) {
    // 初始化帐号配置和security token
    lib.auth.initAccountFile();
    lib.auth.generateSecurityToken();

    // 扫描缓存目录，准备 index.json
    console.log('Prepare repository...');
    lib.util.source = options.source;
    lib.util.prepareSpmCacheDir(callback);
}