'use strict';

const Joi = require('joi');
const UserModel = require('../models/User');
const EventModel = require('../models/Event');
const mongoose = require('mongoose');

exports.getAll = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get all events',
	notes: 'Get all events',
    handler: function (request, reply) {
        EventModel.find({}, function (error, data) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: 'Failed to get data',
                    data: error
                });
            } else {
                reply({
                    statusCode: 200,
                    message: 'Events Successfully Fetched',
                    data: data
                });
            }
        }).populate('events');
    }
};

exports.getOne = {
 cors: {
  origin: ['*']
 },
 tags: ['api'],
 description: 'Get specific event',
 notes: 'Get specific event',
 validate: {
            params: {
             id: Joi.string().required()
            }
        },
    handler: function (request, reply) {
        EventModel.findOne({_id: request.params.id}, function (error, data) {
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
                        message: 'Event Not Found',
                        data: data
                    });
                } else {
                    reply({
                        statusCode: 200,
                        message: 'Event Data Successfully Fetched',
                        data: data
                    });
                }
            }
        });
    }
};

exports.save = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Save event',
	notes: 'Save event and push its id into User events array',
	validate: {
		payload: {
			organizer_id: Joi.string().required(),
			event_name: Joi.string(),
			stuff: Joi.array().items(Joi.object().keys({
				labelName: Joi.string(),
				stuffArray: Joi.array().items(Joi.object().keys({
					stuffName: Joi.string(),
					stuffPrice: Joi.number(),
					stuffAmount: Joi.number()
				}))
			})),
			people: Joi.object({
				peopleMen: Joi.array().items(Joi.object({
					peopleName: Joi.string(),
					peopleNote: Joi.string()
				})
				),
				peopleWomen: Joi.array().items(Joi.object({
					peopleName: Joi.string(),
					peopleNote: Joi.string()
				})
				)
			}),
			place: Joi.object({
				placeName: Joi.string(),
				placeLocation: Joi.string(),
				placePrice: Joi.number(),
				placeMax: Joi.number(),
				placeNote: Joi.string()
			}),
			special_info: Joi.string(),
			start_date: Joi.date(),
			end_date: Joi.date()
		}
	},
	handler: function (request, reply) {
		var Event = new EventModel(request.payload);
		Event.save(function (error) {
			if (error) {
				reply({
					statusCode: 503,
					message: error
				});
			} else {
				UserModel.findOneAndUpdate({_id: request.payload.organizer_id}, { $push: { events: Event._id } }, function (error, data) {
					if (error) {
						reply({
							statusCode: 503,
							message: 'Failed to get data',
							data: error
						});
					} else {
						reply({
							statusCode: 200,
							message: 'User events array Updated Successfully',
							data: data
						});
					}
				});
			}
		})
	}
};

exports.update = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Update specific Event data',
	notes: 'Update specific Event data',
	validate: {
		params: {
			id: Joi.string().required(),
			content: Joi.string().required()
		},
		payload: {
			event_name: Joi.string(),
			stuff: Joi.array().items(Joi.object().keys({
				labelName: Joi.string(),
				stuffArray: Joi.array().items(Joi.object().keys({
					stuffName: Joi.string(),
					stuffPrice: Joi.number(),
					stuffAmount: Joi.number()
				}))
			})),
			people: Joi.object({
				peopleMen: Joi.array().items(Joi.object({
					peopleName: Joi.string(),
					peopleNote: Joi.string()
				})
				),
				peopleWomen: Joi.array().items(Joi.object({
					peopleName: Joi.string(),
					peopleNote: Joi.string()
				})
				)
			}),
			place: Joi.object({
				placeName: Joi.string(),
				placeLocation: Joi.string(),
				placePrice: Joi.number(),
				placeMax: Joi.number(),
				placeNote: Joi.string()
			}),
			special_info: Joi.string(),
			start_date: Joi.date(),
			end_date: Joi.date()
		}
	},
	handler: function (request, reply) {
		if(request.params.content === 'stuff') { 
			EventModel.findOneAndUpdate({_id: request.params.id}, { stuff: request.payload.stuff }, function (error, data) {
				if (error) {
					reply({
						statusCode: 503,
						message: 'Failed to get data',
						data: error
					});
				} else {
					reply({
						statusCode: 200,
						message: 'User event stuff updated successfully',
						data: data
					});
				}
			});
		}
		if(request.params.content === 'people') { 
			EventModel.findOneAndUpdate({_id: request.params.id}, { people: request.payload.people }, function (error, data) {
				if (error) {
					reply({
						statusCode: 503,
						message: 'Failed to get data',
						data: error
					});
				} else {
					reply({
						statusCode: 200,
						message: 'User event people updated successfully',
						data: data
					});
				}
			});
		}
		if(request.params.content === 'general-info') { 
			EventModel.findOneAndUpdate({_id: request.params.id}, { event_name: request.payload.event_name, place: request.payload.place, special_info: request.payload.special_info, start_date: request.payload.start_date, end_date: request.payload.end_date }, function (error, data) {
				if (error) {
					reply({
						statusCode: 503,
						message: 'Failed to get data',
						data: error
					});
				} else {
					reply({
						statusCode: 200,
						message: 'User event general information updated successfully',
						data: data
					});
				}
			});
		}
		if(request.params.content === '') { 
			reply({
				statusCode: 503,
				message: 'Failed to get data'
			});
		}

	}
};


exports.delete = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Remove specific Event data',
	notes: 'Remove specific Event data',
	validate: {
		params: {
			id: Joi.string().required()
		}
	},
	handler: function (request, reply) {
		EventModel.findOneAndRemove({_id: request.params.id}, function (error) {
			if (error) {
				reply({
					statusCode: 503,
					message: 'Error in removing Event',
					data: error
				});
			} else {
				reply({
					statusCode: 200,
					message: 'Event Deleted Successfully'
				});
			}
		});
	}
};