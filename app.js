var express = require('express');
var path = require('path');
var _ = require('underscore');
var controllers = require('./lib/controllers');
var filters = require('./lib/filters');
var app = express();

app.set('views', __dirname + '/lib/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use(function (error, req, res, next) {
    res.status(500).json({
        message : error,
        status : 'error'
    });
});

// router
app.get('/repository', controllers.family.index);
app.get('/repository/:family', controllers.family.show, filters.downloadFilter);
app.get('/repository/:family/:name', controllers.project.show, filters.downloadFilter);
app.get('/repository/:family/:name/:version', controllers.module.show, filters.downloadFilter);

app.post('/repository/:family/:name/:version', filters.authFilter, controllers.module.create);
app.put('/repository/:family/:name/:version', filters.authFilter, controllers.module.update);
app.del('/repository/:family/:name/:version', filters.authFilter, controllers.module.destroy);
app.del('/repository/:family/:name', filters.authFilter, controllers.module.destroy);

app.post('/account/login', controllers.session.create);
app.get('/', controllers.home.show);

module.exports = app;

app.listen(3000)