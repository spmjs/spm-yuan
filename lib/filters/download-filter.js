var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var rimraf = require('rimraf');
var util = require('../base/util');

// 如果当前 repo 中没有会到官网下载
module.exports = function (error, req, res, next) {
    var pkg = _.compact([req.params.family, req.params.name, req.params.version]).join('/');
    var pkgName = pkg;

    // gallery/backbone/1.0.0  => gallery/backbone@1.0.0
    if (req.params.version) {
        pkgName = req.params.family + '/' + req.params.name + '@' + req.params.version;
    }

    var tmpDir = path.join(util.getSpmCacheDir(), '..', 'yuan-tmp');

    var child = exec('spm install ' + pkgName + ' -d ' + tmpDir + ' -s ' + util.source, function (err, stdout, stderr) {
        if (!stderr && !err) {
            util.downloadJSON(pkg, function () {
                res.redirect('/repository/' + pkg);
            });
        } else {
            next(error + ' ' + stderr.trim());
        }
        rimraf.sync(tmpDir);
    });
    console.log('[SPM Install] ' + pkgName);
}