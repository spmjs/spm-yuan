var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var util = require('../base/util');
var Project = require('./project');

var Family = {

    // 返回所有的 family 的名称数组
    all : function (callback) {
        var dir = util.getSpmCacheDir();
        fs.readdir(dir, callback);
    },

    // 返回某个 family 下的所有 projects
    // usage: find({family: 'gallery'}, callback)
    find : function (options, cb) {
        var dir = util.getDir(options);

        async.waterfall([
            // 枚举 family 目录下所有子目录
            function (callback) {
                fs.readdir(dir, callback);
            },

            // 读取所有子目录中的 index.json
            function (projectDirs, callback) {
                async.map(projectDirs, function (projectDir, subCallback) {
                    Project.find({family : options.family, name : projectDir}, function (err, data) {
                        if (err) {
                            subCallback(null)
                        } else {
                            subCallback(null, data);
                        }
                    })
                }, callback);
            },

            // 拼装组成返回数据
            function (projects, callback) {
                projects = _(projects).chain()
                    .map(function (projectJSON) {
                        return _.omit(projectJSON, 'packages');
                    }).sort(function (a, b) {
                        return a.name > b.name;
                    }).value();
                callback(null, projects);
            }

        ], cb);
    }
};

module.exports = Family;