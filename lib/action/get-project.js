var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var semver = require('semver');
var util = require('../util');

// 获取 project ，比如 gallery/moment
// 组合计算所有子目录的 json 后给出数据
function getProject(req, res, next) {
    var dir = util.getModuleDir(req.params);

    getProjectJSON(dir, function (error, json) {
        if (error) {
            util.writeErrorResp(res, 'Repository not found!');
        } else {
            res.end(JSON.stringify(json));
        }
    })

};

function getProjectJSON(dir, cb) {
    async.waterfall([
        // 枚举 project 目录下所有子目录
        function (callback) {
            fs.readdir(dir, callback);
        },

        // 读取所有子目录中的 index.json
        function (versionDirs, callback) {
            async.map(versionDirs, function (versionDir, subCallback) {
                fs.readFile(path.join(dir, versionDir, 'index.json'), function (err, data) {
                    if (err) {
                        subCallback(null)
                    } else {
                        var pkgJSON = JSON.parse(data);
                        subCallback(null, pkgJSON);
                    }

                })
            }, callback);
        },

        // 拼装组成返回数据
        function (pkgJSONArr, callback) {
            pkgJSONArr = _.compact(pkgJSONArr);

            // 选取最新版本
            pkgJSONArr.sort(function(p1,p2){
                return semver.compare(p2.version, p1.version);
            });
            var lastestPkg = pkgJSONArr[0];
            var packages = _.object(_.pluck(pkgJSONArr, 'version'), pkgJSONArr); // array to hash

            // 构建 json
            var data = _.pick(lastestPkg, 'family', 'name', 'repository', 'keywords', 'homepage', 'description', 'created_at', 'updated_at');
            data.version = lastestPkg.version;
            data.packages = packages;

            callback(null, data);
        }

    ], function (error, result) {
        cb(error, result);
    })
};

module.exports = getProject;
getProject.getProjectJSON = getProjectJSON;
