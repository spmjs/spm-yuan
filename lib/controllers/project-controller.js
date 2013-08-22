var path = require('path');
var fs = require('fs');
var async = require('async');
var util = require('../base/util');
var Project = require('../models/project');

module.exports = {

    //  /repository/:family/:project/
    show : function getProject(req, res, next) {
        Project.find(req.params, function (error, project) {
            if (error) {
                next(req.params.family + '/' + req.params.name + ' not found!');
            } else {
                res.json(project);
            }
        });
    }
};