var connect = require('connect');
var connectRoute = require('connect-route');
var lib = require('./lib');
var actions = lib.actions;

var app = connect.createServer(
    connect.logger('dev'),
    connect.favicon(),
    connect.bodyParser(),
    connect.query(),

    connectRoute(function (router) {
        // auth
        router.post('/repository/:family/:name/:version/', actions.checkAuth);
        router.put('/repository/:family/:name/:version/', actions.checkAuth);
        router.delete('/repository/:family/:name/:version/', actions.checkAuth);
        router.delete('/repository/:family/:name/', actions.checkAuth);
    }),

    connectRoute(function (router) {
        router.get('/repository/', actions.getAll);
        router.get('/repository/:family/', actions.getFamily);
        router.get('/repository/:family/:name/', actions.getProject);
        router.get('/repository/:family/:name/:version/', actions.getModule);

        router.post('/repository/:family/:name/:version/', actions.createModule);
        router.put('/repository/:family/:name/:version/', actions.updateModule);
        router.delete('/repository/:family/:name/:version/', actions.deleteModule);
        router.delete('/repository/:family/:name/', actions.deleteModule);

        router.post('/account/login', actions.login);

        router.get('/', function (req, resp) {
            resp.writeHead(302, {
                'Location' : '/assets/index.html'
            });
            response.end();
        })
    }),

    connect.errorHandler()
);

app.use('/repository', connect.static(lib.util.getSpmCacheDir()));
app.use('/assets', connect.static('assets'));

module.exports = app;