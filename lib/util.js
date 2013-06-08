var path = require('path');
var spmrc = require('spmrc');
var _ = require('underscore');
var fs = require('fs');
var request = require('request');
var semver = require('semver');

// 返回当前 spm 的缓存目录，用做 yuan 的 public 目录
var getSpmCacheDir = _.memoize(function () {
    var homeDir = spmrc.get('user.home');
    return path.join(homeDir, '.spm', 'cache');
});

// 准备 spm 的缓存目录，为每个 version 的目录去下载对应的 index.json
function prepareSpmCacheDir() {
    var cacheDir = getSpmCacheDir();
    var versionDirs = [];
    walkDir(cacheDir, versionDirs, function (dirName) {
        return semver.valid(dirName);
    });

    versionDirs.forEach(function (dir) {
        var jsonPath = path.join(dir, 'index.json');
        if (!fs.existsSync(jsonPath)) {
            var jsonUrl = dir.replace(cacheDir, 'repository');
            jsonUrl = ('https://spmjs.org' + '/' + jsonUrl).replace(/\\/g, '/');
            console.log('Download JSON: ' + jsonUrl);
            request(jsonUrl).pipe(fs.createWriteStream(jsonPath));
        }
    });
}

// 递归遍历目录
function walkDir(dir, result, filter) {
    var subDirs = fs.readdirSync(dir);
    subDirs.forEach(function (subDirName) {
        var subDirPath = path.join(dir, subDirName);
        if (fs.statSync(subDirPath).isDirectory()) {
            if (filter(subDirName)) {
                result.push(subDirPath);
            }
            walkDir(subDirPath, result, filter);
        }
    });
}

// 根据 family,name,version 等获取相应的目录名
function getModuleDir(params) {
    return path.join(getSpmCacheDir(), params.family, params.name || '', params.version || '');
}

// 返回错误的 HTTP 响应
function writeErrorResp(resp, err) {
    resp.writeHead(500);
    resp.end(JSON.stringify({
        message : err,
        status : 'error'
    }));
}


exports.getSpmCacheDir = getSpmCacheDir;
exports.getModuleDir = getModuleDir;
exports.writeErrorResp = writeErrorResp;
exports.prepareSpmCacheDir = prepareSpmCacheDir;