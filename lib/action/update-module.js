var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var _ = require('underscore');
var async = require('async');
var semver = require('semver');
var util = require('../util');

// 更新 module ，通常是处理上传的 tar
module.exports = function updateModule(req, res, next) {
    var pkgDir = util.getModuleDir(req.params);
    var pkgFile = path.join(pkgDir, req.params.name + '-' + req.params.version + '.tar.gz');
    var pkgJsonFile = path.join(pkgDir, 'index.json');

    var md5 = req.headers['x-package-md5'];
    var ws = fs.createWriteStream(pkgFile + '.tmp');
    var verifier = crypto.createHash('md5');

    async.waterfall([

        // 读取 req 流
        function (callback) {
            req.pipe(ws);
            req.pipe(verifier, {end : false});
            req.on('end', callback);
        },

        // 校验 MD5
        function (callback) {
            if (verifier.digest('hex') === md5) {
                fs.rename(pkgFile + '.tmp', pkgFile, callback);
            } else {
                callback('md5 error');
            }
        },

        // 读取原有的 package json
        function (callback) {
            fs.readFile(pkgJsonFile, callback);
        },

        // 修改 package json
        function (data, callback) {
            var pkgJson = JSON.parse(data);
            _.extend(pkgJson, {
                "updated_at" : new Date(),
                "filename" : path.basename(pkgFile),
                "md5" : md5
            });
            fs.writeFile(pkgJsonFile, JSON.stringify(pkgJson), callback);
        }

    ], function (error, result) {
        if (error) {
            util.writeErrorResp(res, error);
        } else {
            res.end('ok');
        }
    });

};