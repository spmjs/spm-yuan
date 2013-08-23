var exec = require('child_process').exec;
var _ = require('underscore');
var util = require('../base/util');

// 如果当前 repo 中没有会到官网下载
module.exports = function (error, req, res, next) {
    var pkg = _.compact([req.params.family, req.params.name, req.params.version]).join('/');

    var child = exec('spm install ' + pkg + ' -s http://spmjs.com', function (err, stdout, stderr) {
        if (!stderr && !err) {
            util.downloadJSON(pkg, function () {
                res.redirect('/repository/' + pkg);
            });
        } else {
            next(error + stderr);
        }
    });
}