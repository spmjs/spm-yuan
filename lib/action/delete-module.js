var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var async = require('async');
var semver = require('semver');
var util = require('../util');
var rimraf = require('rimraf');

// 删除 module
module.exports = function deleteModule(req, res, next) {
    var dir = util.getModuleDir(req.params);

    async.waterfall([
        // 检查是否存在
        function (callback) {
            fs.exists(dir, function (exists) {
                if (exists) {
                    callback();
                } else {
                    callback('Repository not found!')
                }
            });
        },

        // 删除 pkg 文件夹
        function (callback) {
            rimraf(dir, callback);
        }
    ], function (error) {
        if (error) {
            util.writeErrorResp(res, error);
        } else {
            res.end(JSON.stringify({
                status : 'info',
                message : 'Repository deleted'
            }));
        }
    });
};