'use strict';

const Joi = require('joi');
const UserModel = require('../models/User');
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
        }).populate('events');
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
        UserModel.findOne({_id: request.params.id}, function (error, data) {
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
                        avatar: data.avatar.data,
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
		UserModel.findOne({ email: request.payload.email }, function(err, User) {
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
        var User = new UserModel(request.payload);

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

exports.update = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Update specific user data',
	notes: 'Update specific user data',
	validate: {
		params: {
			id: Joi.string().required()
		},
		payload: {
			name: Joi.string(),
			avatar: Joi.any(),
			age: Joi.number(),
			note: Joi.number()
		}
	},
	handler: function (request, reply) {
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
};

exports.updateAvatar = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Update specific user data',
	notes: 'Update specific user data',
	validate: {
		params: {
			id: Joi.string().required()
		},
		payload: {
			avatar: Joi.string()
		}
	},
	handler: function (request, reply) {
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
};


exports.getUserEvents = {
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
        UserModel.findOne({_id: request.params.id}, function (error, data) {
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
                        data: data.events
                    });
                }
            }
        }).populate('events');
    }
};

exports.changePassword = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Update specific user data',
	notes: 'Update specific user data',
	validate: {
		params: {
			id: Joi.string().required()
		},
		payload: {
			oldpassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
			password_confirmation: Joi.any().valid(Joi.ref('password')).required()
		}
	},
    handler: function (request, reply) {
		UserModel.findOne({_id: request.params.id}, function(err, User) {
		    if (err) throw err;
		    User.comparePassword(request.payload.oldpassword, function(err, isMatch) {
		        if (err) {
	                reply({
	                    statusCode: 503,
	                    message: 'Failed to get data',
	                    data: err
	                });
	            }
				else if (isMatch) {
					    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
					        if (err) return next(err);
					        bcrypt.hash(request.payload.password, salt, function(err, hash) {
					            if (err) return next(err);
								UserModel.findOneAndUpdate({_id: request.params.id}, {password: hash}, function (error, data) {
									if (error) {
										reply({
											statusCode: 503,
											message: 'Failed to get data',
											data: error
										});
									} else {
										reply({
											statusCode: 200,
											message: 'Password changed Successfully'
										});
									}
								});
					        });
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

