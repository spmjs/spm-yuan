var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var async = require('async');
var semver = require('semver');
var util = require('../util');
var Module = require('./module');

var Project = {
    // 获取某个 project, 组合计算所有子目录的 json 后给出数据
    // useage: find({family: 'gallery', name: 'jquery'}, callback)
    find : function (options, cb) {
        var dir = util.getDir(options);

        async.waterfall([
            // 枚举 project 目录下所有子目录
            function (callback) {
                fs.readdir(dir, callback);
            },

            // 读取所有子目录中的 index.json
            function (versionDirs, callback) {
                async.map(versionDirs, function (versionDir, subCallback) {
                    Module.find(_.extend({version : versionDir}, options), function (err, data) {
                        if (err) {
                            subCallback(null);
                        } else {
                            subCallback(null, data);
                        }
                    });
                }, callback);
            },

            // 拼装组成返回数据
            function (packages, callback) {
                packages = _.compact(packages);

                // 选取最新版本
                packages.sort(function (p1, p2) {
                    return semver.compare(p2.version, p1.version);
                });
                var latestPkg = packages[0];
                packages = _.object(_.pluck(packages, 'version'), packages); // array to hash

                // 构建 json
                var data = _.pick(latestPkg, 'family', 'name', 'version', 'repository', 'keywords',
                    'homepage', 'description', 'created_at', 'updated_at');
                data.packages = packages;

                callback(null, data);
            }

        ], function (error, result) {
            cb(error, result);
        })
    }
};

module.exports = Project;