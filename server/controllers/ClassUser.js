'use strict';

const Joi = require('joi');
const ClassUserModel = require('../models/ClassUser');
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;



exports.getAll = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get All User data',
	notes: 'Get All User data',
    handler: function (request, reply) {
        ClassUserModel.find({}, function (error, data) {
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
        }).populate('classes');
    }
};

exports.getUser = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get All User data',
	notes: 'Get All User data',
	validate: {
            params: {
            	id: Joi.string().required()
            }
        },
    handler: function (request, reply) {
        ClassUserModel.findOne({_id: request.params.id}, function (error, data) {
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
};

exports.logIn = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get All User data',
	notes: 'Get All User data',
	validate: {
		payload: {
			email: Joi.string().required().email(),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
		}
	},
    handler: function (request, reply) {
		ClassUserModel.findOne({ email: request.payload.email }, function(err, User) {
		    if (err) throw err;
		    User.comparePassword(request.payload.password, function(err, isMatch) {
		        if (err) {
	                reply({
	                    statusCode: 503,
	                    message: 'Failed to get data',
	                    data: err
	                });
	            }
				else if (isMatch) {
	                reply({
	                    statusCode: 200,
	                    message: 'User Logged Successfully',
	                    data: User._id
	                });
	            }
	            else {
	                reply({
	                    statusCode: 403,
	                    message: 'User Bad Password'
	                });
	            }
		    });
		});
   }
};

exports.signUp = {
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
	},
	handler: function (request, reply) {
        var User = new ClassUserModel(request.payload);

        User.save(function (error) {
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
};

exports.getUserClasses = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get All User data',
	notes: 'Get All User data',
	validate: {
		params: {
			id: Joi.string().required()
		}
	},
    handler: function (request, reply) {
        ClassUserModel.findOne({_id: request.params.id}, function (error, data) {
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
                        data: data.classes
                    });
                }
            }
        }).populate('classes');
    }
};