var async = require('async');
var Family = require('../models/family');
var Project = require('../models/project');

module.exports = {
    show : function (req, res) {

        async.waterfall([

            function (callback) {
                Family.all(callback);
            },

            function (families, callback) {
                async.map(families, function (family, subCallback) {
                    Family.find({family : family}, function (error, projects) {
                        subCallback(null, {
                            name : family,
                            projects : projects
                        })
                    });
                }, callback);
            }

        ], function (error, families) {
            res.render('index', {
                families : families
            });
        });
    }
}