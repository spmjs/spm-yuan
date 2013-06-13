var fs = require('fs');
var util = require('../util');

// 给出一个简单的 HTML 页面用于查看当前所有的模块
module.exports = function getAll(req, res, next) {
    var dir = util.getSpmCacheDir();

    fs.readdir(dir, function (error, familyDirs) {
        if (error) {
            util.writeErrorResp(res, 'No family!');
        } else {
            res.end(JSON.stringify(familyDirs));
        }
    });
}

