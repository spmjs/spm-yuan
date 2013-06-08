var auth = require('../auth');

// 是否授权
module.exports = function checkAuth(req, res, next) {
    var authStr = req.headers.authorization + '';
    var arr = authStr.replace('Yuan', '').trim().split('-');
    if (arr[1] === auth.getHmac(arr[0])) {
        req.author = arr[0];
        next();
    } else {
        res.writeHead(401);
        res.end(JSON.stringify({
            message : 'Please login first!',
            status : 'error'
        }));
    }
}