var fs = require('fs');
var _ = require('underscore');
var util = require('../util');
var auth = require('../auth');

// 登录
module.exports = function login(req, res) {
    var user = _(auth.getAccounts()).findWhere({
        username : req.body.account,
        password : req.body.password
    });

    if (user) {
        res.end(JSON.stringify({
            data : user.username + '-' + auth.getHmac(user.username)
        }));
    } else {
        util.writeErrorResp(res, 'Login Failed!');
    }
}
