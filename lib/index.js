exports.actions = {};

exports.actions.getModule = require('./action/get-module');
exports.actions.getProject = require('./action/get-project');
exports.actions.getFamily = require('./action/get-family');
exports.actions.getAll = require('./action/get-all');
exports.actions.createModule = require('./action/create-module');
exports.actions.updateModule = require('./action/update-module');
exports.actions.deleteModule = require('./action/delete-module');
exports.actions.login = require('./action/login');
exports.actions.checkAuth = require('./action/check-auth');

exports.util = require('./util');
exports.auth = require('./auth');