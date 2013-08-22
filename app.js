//var connect = require('connect');
//var connectRoute = require('connect-route');
//var path = require('path');
//var lib = require('./lib');
//var actions = lib.actions;
//
//var app = connect.createServer(
//    connect.logger('dev'),
//    connect.favicon(),
//    connect.bodyParser(),
//    connect.query(),
//
//    connectRoute(function (router) {
//        // auth
//        router.post('/repository/:family/:name/:version/', actions.checkAuth);
//        router.put('/repository/:family/:name/:version/', actions.checkAuth);
//        router.delete('/repository/:family/:name/:version/', actions.checkAuth);
//        router.delete('/repository/:family/:name/', actions.checkAuth);
//    }),
//
//    connectRoute(function (router) {
//        router.get('/repository/', actions.getAll);
//        router.get('/repository/:family/', actions.getFamily);
//        router.get('/repository/:family/:name/', actions.getProject);
//        router.get('/repository/:family/:name/:version/', actions.getModule);
//
//        router.post('/repository/:family/:name/:version/', actions.createModule);
//        router.put('/repository/:family/:name/:version/', actions.updateModule);
//        router.delete('/repository/:family/:name/:version/', actions.deleteModule);
//        router.delete('/repository/:family/:name/', actions.deleteModule);
//
//        router.post('/account/login', actions.login);
//
//        router.get('/', function (req, resp) {
//            resp.writeHead(302, {
//                'Location' : '/assets/index.html'
//            });
//            resp.end();
//        })
//    }),
//
//    connect.errorHandler()
//);
//
//app.use('/repository', connect.static(lib.util.getSpmCacheDir()));
//app.use('/assets', connect.static(path.join(__dirname, 'assets')));
//
//module.exports = app;

var express = require('express');
var path = require('path');
var controllers = require('./lib/controllers');
var authFilter = require('./lib/filter/auth-filter');
var app = express();

app.set('views', __dirname + '/lib/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({
    key : '_spm_yuan_session',
    secret : 'sb'
}));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/repository', controllers.family.index);
app.get('/repository/:family', controllers.family.show);
app.get('/repository/:family/:name', controllers.project.show);
app.get('/repository/:family/:name/:version', controllers.module.show);

app.post('/repository/:family/:name/:version', authFilter, controllers.module.create);
app.put('/repository/:family/:name/:version', authFilter, controllers.module.update);
app.del('/repository/:family/:name/:version', authFilter, controllers.module.destroy);
app.del('/repository/:family/:name', authFilter, controllers.module.destroy);

app.post('/account/login', controllers.session.create);
app.get('/', controllers.home.show);
app.listen(3000)