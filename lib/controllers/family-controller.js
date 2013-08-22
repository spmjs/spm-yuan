var fs = require('fs');
var Family = require('../models/family');

module.exports = {

    //  /repository
    index : function (req, res, next) {
        Family.all(function (error, families) {
            if (error) {
                next('No family!');
            } else {
                res.json(families);
            }
        });
    },

    //  /repository/:family/
    show : function (req, res, next) {
        Family.find(req.params, function (error, projects) {
            if (error) {
                next(req.params.family + ' not found!');
            } else {
                res.json(projects);
            }
        })
    }
};

