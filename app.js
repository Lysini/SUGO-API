var Hapi = require('hapi');
var Joi = require('joi');
const Inert = require('inert');
const Vision = require('vision');
const routes = require('./server/routes');
const db = require('./server/config/db');
const config = require('./server/config/config');

var server = new Hapi.Server();

var app = {};
app.config = config;

server.connection({  
    host: app.config.server.host,
    port: app.config.server.port
});

server.route(routes.endpoints);

const options = {
    info: {
            'title': 'SUGO-WEB API',
            'version': "0.0.1",
        }
    };

server.register([
    Inert,
    Vision,
    {
	    register: require('hapi-swagger'),
	    options: options
}]);   

server.register({
    register: require('good'),
    options: {
        ops: {
            interval: 1000
        },
        reporters: {
            reporter: [{
                module: 'good-console',
                args: [{ log: '*', response: '*'}]
            }]
        }
    }
}, function (err) {
    if (err) {
        console.error(err);
    }
    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });

});
