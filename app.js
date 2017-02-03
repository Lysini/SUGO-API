// Include Hapi package
var Hapi = require('hapi');

// Include Joi package to validate request params and payload.
var Joi = require('joi');

const Inert = require('inert');
const Vision = require('vision');

// Create Server Object
var server = new Hapi.Server();

// Include Mongoose ORM to connect with database
var mongoose = require('mongoose');

// Making connection with `restdemo` database in your local machine
mongoose.connect('mongodb://localhost/restdemo');

// Importing `user` model from `models/user.js` file
var UserModel = require('./models/User');
var EventModel = require('./models/Event');

// Define PORT number You can change it if you want
server.connection({  
    host: 'localhost',
    port: 8000
});

const options = {
    info: {
            'title': 'Test API Documentation',
            'version': "0.0.1",
        }
    };

// Register Swagger Plugin ( Use for documentation and testing purpose )
server.register([
    Inert,
    Vision,
    {
	    register: require('hapi-swagger'),
	    options: options
}]);   

// Fetching all users data
server.route({
    method: 'GET',
    path: '/api/user',
    config: {
        cors: {
            origin: ['*']
        },
        // Include this API in swagger documentation
        tags: ['api'],
        description: 'Get All User data',
        notes: 'Get All User data'
    },
    handler: function (request, reply) {
        //Fetch all data from mongodb User Collection
        UserModel.find({}, function (error, data) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: 'Failed to get data',
                    data: error
                });
            } else {
                reply({
                    statusCode: 200,
                    message: 'User Data Successfully Fetched',
                    data: data
                });
            }
        });
    }
});

server.route({
    method: 'GET',
    //Getting data for particular user "/api/user/1212313123"
    path: '/api/user/{id}',
    config: {
        cors: {
            origin: ['*']
        },
        tags: ['api'],
        description: 'Get specific user data',
        notes: 'Get specific user data',
        validate: {
            // Id is required field
            params: {
                id: Joi.string().required()
            }
        }
    },
    handler: function (request, reply) {

        //Finding user for particular userID
        UserModel.find({_id: request.params.id}, function (error, data) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: 'Failed to get data',
                    data: error
                });
            } else {
                if (data.length === 0) {
                    reply({
                        statusCode: 200,
                        message: 'User Not Found',
                        data: data
                    });
                } else {
                    reply({
                        statusCode: 200,
                        message: 'User Data Successfully Fetched',
                        data: data
                    });
                }
            }
        });
    }
});

server.route({
    method: 'PUT',
    path: '/api/user/{id}',
    config: {
        cors: {
            origin: ['*']
        },
        // Swagger documentation fields tags, description, note
        tags: ['api'],
        description: 'Update specific user data',
        notes: 'Update specific user data',

        // Joi api validation
        validate: {
            params: {
                //`id` is required field and can only accept string data
                id: Joi.string().required()
            },
            payload: {
                name: Joi.string().required(),
                surname: Joi.string().required(),
                pseudonim: Joi.string().required(),
                avatar: Joi.string().required(),
                age: Joi.number().required()
            }
        }
    },
    handler: function (request, reply) {

        // `findOneAndUpdate` is a mongoose modal methods to update a particular record.
        UserModel.findOneAndUpdate({_id: request.params.id}, request.payload, function (error, data) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: 'Failed to get data',
                    data: error
                });
            } else {
                reply({
                    statusCode: 200,
                    message: 'User Updated Successfully',
                    data: data
                });
            }
        });

    }
});

server.route({
    method: 'POST',
    path: '/api/user/sign-up',
    config: {
        cors: {
            origin: ['*']
        },
        tags: ['api'],
        description: 'Save user data',
        notes: 'Save user data',
        validate: {
            payload: {
            	name: Joi.string().min(3).max(30).required(),
                email: Joi.string().required().email(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
                password_confirmation: Joi.any().valid(Joi.ref('password')).required()
            }
        }
    },
    handler: function (request, reply) {

        // Create mongodb user object to save it into database
        var user = new UserModel(request.payload);

        //Call save methods to save data into database and pass callback methods to handle error
        user.save(function (error) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: error
                });
            } else {
                reply({
                    statusCode: 201,
                    message: 'User Saved Successfully'
                });
            }
        });
    }
});

server.route({
    method: 'POST',
    path: '/api/event/',
    config: {
        cors: {
            origin: ['*']
        },
        tags: ['api'],
        description: 'Save event data',
        notes: 'Save event data',
        validate: {
            payload: {
                name: Joi.string().required(),
                surname: Joi.string().required(),
            }
        }
    },
    handler: function (request, reply) {

        // Create mongodb user object to save it into database
        var Event = new EventModel(request.payload);

        //Call save methods to save data into database and pass callback methods to handle error
        Event.save(function (error) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: error
                });
            } else {
                reply({
                    statusCode: 201,
                    message: 'User Saved Successfully'
                });
            }
        });
    }
});

server.route({
    method: 'POST',
    path: '/api/user/log-in',
    config: {
        cors: {
            origin: ['*']
        },
        tags: ['api'],
        description: 'Save user data',
        notes: 'Save user data',
        validate: {
            payload: {
                email: Joi.string().required().email(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
            }
        }
    },
    handler: function (request, reply) {

        // `findOneAndUpdate` is a mongoose modal methods to update a particular record.
        UserModel.findOne({email: request.payload.email, password: request.payload.password}, request.payload, function (error, data) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: 'Failed to get data',
                    data: error
                });
            } else {
                reply({
                    statusCode: 200,
                    message: 'User Updated Successfully',
                    data: data
                });
            }
        });
    }
});

server.route({
    method: 'DELETE',
    path: '/api/user/{id}',
    config: {
        cors: {
            origin: ['*']
        },
        tags: ['api'],
        description: 'Remove specific user data',
        notes: 'Remove specific user data',
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    },
    handler: function (request, reply) {

        // `findOneAndRemove` is a mongoose methods to remove a particular record into database.
        UserModel.findOneAndRemove({_id: request.params.id}, function (error) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: 'Error in removing User',
                    data: error
                });
            } else {
                reply({
                    statusCode: 200,
                    message: 'User Deleted Successfully'
                });
            }
        });

    }
});

// Register Good Plugin ( Use to log API url's hit on serer )
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
	// Lets start the server
	server.start(function () {
	    console.log('Server running at:', server.info.uri);
	});

});
