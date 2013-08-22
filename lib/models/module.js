var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var async = require('async');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var util = require('../util');

var Module = {

    find : function (options, callback) {
        var dir = util.getDir(options);
        fs.readFile(path.join(dir, 'index.json'), function (err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, JSON.parse(data));
            }
        })
    },

    // Module.create({family:'gallery', project:'jquery', module: '1.9.2', ...}, callback)
    create : function (options, cb) {
        var dir = util.getDir(options);
        mkdirp(dir, function () {
            fs.writeFile(path.join(dir, 'index.json'), JSON.stringify(options), cb);
        });
    },

    // Module.update({tmpFile: '', md5: '', ...}, callback)
    update : function (options, cb) {
        var pkgDir = util.getDir(options);
        var pkgFile = path.join(pkgDir, options.name + '-' + options.version + '.tar.gz');
        var pkgJsonFile = path.join(pkgDir, 'index.json');

        async.waterfall([
            function (callback) {
                fs.rename(options.tmpFile, pkgFile, callback);
            },

            function (callback) {
                fs.readFile(pkgJsonFile, callback);
            },

            // 修改 package json
            function (data, callback) {
                var pkgJson = JSON.parse(data);
                _.extend(pkgJson, {
                    "updated_at" : new Date(),
                    "filename" : path.basename(pkgFile),
                    "md5" : options.md5
                });
                fs.writeFile(pkgJsonFile, JSON.stringify(pkgJson), callback);
            }
        ], cb);
    },

    // Module.destroy({family: '', name: ''}, callback)
    destroy : function (options, cb) {
        var dir = util.getDir(options);

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
        ], cb);
    }
};

module.exports = Module;