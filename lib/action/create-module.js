var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('underscore');
var async = require('async');
var util = require('../util');

// 创建 module
module.exports = function createModule(req, res, next) {
    var dir = util.getModuleDir(req.params);
    mkdirp(dir, function () {
        var pkg = _.extend({}, req.body, {
            publisher : req.author,
            "created_at" : new Date()
        });
        fs.writeFile(path.join(dir, 'index.json'), JSON.stringify(pkg), function () {
            res.end('ok');
        });
    });
}