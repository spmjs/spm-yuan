var path = require('path');
var fs = require('fs');
var _ = require('underscore')
var crypto = require('crypto');
var async = require('async');
var util = require('../util');
var Module = require('../models/module');

module.exports = {
    // 获取 module ，比如 gallery/moment@1.7.2
    // 返回目录下的 index.json
    show : function (req, res, next) {
        Module.find(req.params, function (err, data) {
            if (err) {
                //subCallback(null);
            } else {
                res.json(data);
            }
        });
    },

    // 创建 module
    create : function (req, res, next) {
        var options = _.extend({
            publisher : req.author,
            "created_at" : new Date()
        }, req.body, req.params);

        Module.create(options, function () {
            res.end('ok');
        });
    },

    // 更新 module ，通常是处理上传的 tar
    update : function (req, res, next) {
        var md5 = req.headers['x-package-md5'];
        var tmpFile = path.join(util.getSpmCacheDir(), Date.now() + '.tmp');
        var ws = fs.createWriteStream(tmpFile);
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
                    var options = _.extend({
                        tmpFile : tmpFile,
                        md5 : md5
                    }, req.params)
                    Module.update(options, callback);
                } else {
                    callback('md5 error');
                }
            }
        ], function (error, result) {
            if (error) {
                util.writeErrorResp(res, error);
            } else {
                res.end('ok');
            }
        });
    },

    // 删除 module
    destroy : function (req, res, next) {
        Module.destroy(req.params, function (error) {
            if (error) {
                util.writeErrorResp(res, error);
            } else {
                res.json({
                    status : 'info',
                    message : 'Repository deleted'
                });
            }
        });
    }
};