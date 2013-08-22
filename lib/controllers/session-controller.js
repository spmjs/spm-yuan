var fs = require('fs');
var _ = require('underscore');
var util = require('../base/util');
var auth = require('../base/auth');

module.exports = {
    // 登录
    create : function (req, res, next) {
        var user = _(auth.getAccounts()).findWhere({
            username : req.body.account,
            password : req.body.password
        });

        if (user) {
            res.end(JSON.stringify({
                data : user.username + '-' + auth.getHmac(user.username)
            }));
        } else {
            next('Login Failed!');
        }
    }
}
