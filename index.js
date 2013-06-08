var app = require('./app');
var lib = require('./lib');
var cluster = require('cluster');
var os = require('os');

exports = module.exports = function (options) {
    var port = options.port || 3000;
    var workerNum = options.workerNum || os.cpus().length;
    var workers = {};

    if (cluster.isMaster) {
        initEnv();
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
function initEnv() {
    // 初始化帐号配置和security token
    lib.auth.initAccountFile();
    lib.auth.generateSecurityToken();

    // 扫描缓存目录，准备 index.json
    console.log('Prepare repository...');
    lib.util.prepareSpmCacheDir();
}