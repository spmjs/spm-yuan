var path = require('path');
var spmrc = require('spmrc');
var _ = require('underscore');
var fs = require('fs');
var request = require('request');
var semver = require('semver');
var async = require('async');

// 返回当前 spm 的缓存目录，用做 yuan 的 public 目录
var getSpmCacheDir = _.memoize(function () {
    var homeDir = spmrc.get('user.home');
    return path.join(homeDir, '.spm', 'cache');
});

function getPkgDirPath(dir) {
    return path.join(getSpmCacheDir(), dir);
}

// 准备 spm 的缓存目录，为每个 version 的目录去下载对应的 index.json
function prepareSpmCacheDir(callback) {
    async.map(fs.readdirSync(getSpmCacheDir()), function (dir, cb) {
        downloadJSON(dir, cb);
    }, callback);
}

// downloadJSON('gallery/jquery/1.9.1')
// downloadJSON('gallery/jquery')
// downloadJSON('gallery')
function downloadJSON(pkg, callback) {
    if (pkg.split('/').length === 1) {
        async.map(fs.readdirSync(getPkgDirPath(pkg)), function (subDirName, cb) {
            downloadJSON(pkg + '/' + subDirName, cb);
        }, callback);
    } else if (pkg.split('/').length === 2) {
        async.map(fs.readdirSync(getPkgDirPath(pkg)), function (subDirName, cb) {
            if (semver.valid(subDirName)) {
                downloadJSON(pkg + '/' + subDirName, cb);
            }
        }, callback);
    } else {
        downloadVersionJSON(pkg, callback);
    }
}

// downloadVersionJSON('gallery/jquery/1.9.1')
function downloadVersionJSON(pkg, callback) {
    var jsonPath = path.join(getSpmCacheDir(), pkg, 'index.json');
    if (fs.existsSync(jsonPath)) {
        callback();
    } else {
        var jsonUrl = exports.source + '/repository/' + pkg;
        console.log('[Download JSON] ' + jsonUrl);
        request(jsonUrl,function (error, response, body) {
            if (error || response.statusCode !== 200) {
                try{
                    fs.unlinkSync(jsonPath);
                }catch(e){
                }
                console.warn('[Download Failed] ' + jsonUrl);
            }
            callback(error);
        }).pipe(fs.createWriteStream(jsonPath));
    }
}

// 根据 family,name,version 等获取相应的目录名
function getDir(params) {
    return path.join(getSpmCacheDir(), params.family, params.name || '', params.version || '');
}

exports.getSpmCacheDir = getSpmCacheDir;
exports.getDir = getDir;
exports.downloadJSON = downloadJSON;
exports.prepareSpmCacheDir = prepareSpmCacheDir;
exports.source = '';  // remote repo url