var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var _ = require('underscore');

function getAccountFilePath() {
    var homedir = process.env.HOME;
    if (!homedir) {
        homedir = process.env.HOMEDRIVE + process.env.HOMEPATH;
    }
    return path.join(homedir, '.spm', 'yuan_account.json');
}


function getAccounts() {
    return require(getAccountFilePath());
}

// 初始化 account 配置文件，如果不存在的话
function initAccountFile() {
    var path = getAccountFilePath();
    if (!fs.existsSync(path)) {
        var initAccounts = [
            {"username" : "spm", "password" : "password" }
        ];
        fs.writeFileSync(path, JSON.stringify(initAccounts, null, '\t'))
    }
}

// 计算 HMAC
function getHmac(text) {
    var securityToken = require('./security-token.json');
    var hmac = crypto.createHmac('sha1', securityToken);
    return hmac.update(text).digest('hex');
}

// 用随机字符串填充 security-token.json
function generateSecurityToken() {
    var tokenPath = path.join(__dirname, 'security-token.json');
    var token = JSON.parse(fs.readFileSync(tokenPath));
    if (!token) {
        var randomStr = _('abcdefghijklmnopqrstuvwxyz+-='.split('')).chain().shuffle().first(16).value().join('');
        fs.writeFileSync(tokenPath, JSON.stringify(randomStr));
    }
}

exports.initAccountFile = initAccountFile;
exports.getAccounts = getAccounts;
exports.getHmac = getHmac;
exports.generateSecurityToken = generateSecurityToken;