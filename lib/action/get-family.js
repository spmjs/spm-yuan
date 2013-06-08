var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var semver = require('semver');
var request = require('request')
var util = require('../util');
var getProjectJSON = require('./get-project').getProjectJSON;

// 获取 family ，比如 gallery
// 组合计算所有子目录的 json 后给出数据
module.exports = function getModule(req, res, next) {
    var dir = util.getModuleDir(req.params);


    async.waterfall([
        // 枚举 project 目录下所有子目录
        function (callback) {
            fs.readdir(dir, callback);
        },

        // 读取所有子目录中的 index.json
        function (projectDirs, callback) {
            async.map(projectDirs, function (projectDir, subCallback) {
                getProjectJSON(path.join(dir, projectDir), function (err, data) {
                    if (err) {
                        subCallback(null)
                    } else {
                        subCallback(null, data);
                    }

                })
            }, callback);
        },

        // 拼装组成返回数据
        function (projectJSONArr, callback) {
            projectJSONArr = _.map(projectJSONArr, function (projectJSON) {
                return _.omit(projectJSON, 'packages');
            });
            projectJSONArr.sort(function (a, b) {
                return a.name > b.name;
            });
            callback(null, projectJSONArr);
        }

    ], function (error, result) {
        if (error) {
            util.writeErrorResp(res, 'Repository not found!');
        } else {
            res.end(JSON.stringify(result));
        }
    })
}

