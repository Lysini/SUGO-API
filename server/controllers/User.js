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
        UserModel.find({}, '-_id', function (error, data) {
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
	description: 'Get specific User data',
	notes: 'Get specific User data',
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

exports.getUserProfile = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: "Get specific User's profile data",
	notes: "Get specific User's profile data",
	validate: {
            params: {
            	login: Joi.string().required()
            }
        },
    handler: function (request, reply) {
        UserModel.findOne({login: request.params.login}, '-_id', function (error, data) {
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
	description: 'Log in user',
	notes: 'Log in User, in response you get User name and id',
	validate: {
		payload: {
			email: Joi.string().email().required(),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
		}
	},
    handler: function (request, reply) {
		UserModel.findOne({ email: request.payload.email }, 'password name', function(err, User) {
		    if (err) {
	                reply({
	                    statusCode: 503,
	                    message: 'Failed to get data',
	                    data: err
	                });
	        }
	        if (User === null) {
	        		reply({
	                    statusCode: 403,
	                    message: 'Something gone wrong. Please try again.'
	                });
	        }
	        else {
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
		                    data:{
		                    	name: User.name,
		                   		id: User._id
		                    }

		                });
		            }
		            else {
		                reply({
		                    statusCode: 403,
		                    message: 'Bad password'
		                });
		            }
			    });
		}
		});
   }
};

exports.signUp = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Sign up and save user',
	notes: 'Sign up and save user',
	validate: {
		payload: {
			name: Joi.string().min(3).max(30).required(),
			email: Joi.string().required().email(),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
			password_confirmation: Joi.any().valid(Joi.ref('password')).required(),
			login: Joi.string().min(3).max(30).required()
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
        			message: 'User signed up and saved successfully'
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
	description: 'Update user',
	notes: 'Use to update one of user: name, age, note',
	validate: {
		params: {
			id: Joi.string().required()
		},
		payload: {
			name: Joi.string(),
			age: Joi.number(),
			note: Joi.string()
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
	description: 'Update user avatar',
	notes: 'Use to update user avatar',
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
					message: 'User Avatar Updated Successfully',
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
	description: 'Get User events',
	notes: 'Get User events',
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
	description: 'Change password of User',
	notes: 'Change password of User',
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

