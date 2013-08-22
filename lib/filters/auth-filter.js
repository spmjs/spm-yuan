var _ = require('underscore');
var auth = require('../base/auth');

// 是否授权
module.exports = function checkAuth(req, res, next) {
    var authStr = req.headers.authorization + '';
    var arr = authStr.replace('Yuan', '').trim().split('-');
    if (arr[1] === auth.getHmac(arr[0])) {
        var author = _(auth.getAccounts()).findWhere({username : arr[0]});
    }
    if (author) {
        req.author = author.username;
        next();
    } else {
        res.status(401).json({
            message : 'Please login first!',
            status : 'error'
        });
    }
}
