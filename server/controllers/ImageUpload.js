'use strict';

const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Joi = require('joi');
var SALT_WORK_FACTOR = 10;
var fs = require('fs');
var path = require('path');
var gridfs = require('mongoose-gridfs');
var uuid = require('node-uuid');
var digestStream = require('digest-stream');
var HapiSwagger = require('hapi-swagger');


exports.imageUpload = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get All User data',
	notes: 'Get All User data',
	plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
	},
	validate: {
            payload: {
                file: Joi.any()
                    .meta({ swaggerType: 'file' })
                    .description('json file')
            }
	},
	payload: {
		maxBytes: 256000,
		output: 'stream',
		parse: true
	},
	handler: function(request, reply) {

		var sendFailure = function(code, errorMsg) {
			return reply({
				success: false,
				error: errorMsg
			}).code(code);
		};

		var sendSuccess = function(fresh, hash) {
			return reply({
				success: true,
				fresh: fresh,
				filename: hash
			}).code(201);
		};


		var uploadStream = request.payload['image'];

		// A very quick and dirty way to check the file extension
		var fileExt = path.extname(uploadStream.hapi.filename).substr(1).toLowerCase();

		// Check the content type
		var contentType = uploadStream.hapi.headers['content-type'];
		// Store the file to te temp folder
		var tmpFileName = uuid.v4() + '.' + fileExt;
		var tmpFilePath = (require('os').tmpdir() + '/') + tmpFileName;
		var fd = fs.createWriteStream(tmpFilePath);

		// Create a digest hash based on the file's contents
		var digestHash;
		var dstream = digestStream('sha1', 'hex', function(digest) {
			digestHash = digest;
		});

		// Pipe through digest-stream to the temp file
		uploadStream.pipe(dstream).pipe(fd);

		uploadStream.on('end', function() {
			var newFileName = digestHash;
			var newFilePath = (process.cwd() + '/uploads/') + newFileName;

			// Check if a file with the same hash already exists
			fs.access(newFilePath, function(nonExistent) {
				if(!nonExistent) {
					// The file already exists; discard our temp file
					return fs.unlink(tmpFilePath, function(err) {
						// NOTE: Let a possible error silently pass
						// Notify the client about the info
						return sendSuccess(false, newFileName);
					});
				}

				// Move file to its new location
				fs.rename(tmpFilePath, newFilePath, function(err) {
					if(err) {
						// Just send a 500, it's safest
						return sendFailure(500, 'Internal server error');
					}
					// Notify the client about the info
					return sendSuccess(true, newFileName);
				});
			});
		});
	}
};

exports.imageGet = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get All User data',
	notes: 'Get All User data',
	validate: {
        params: {
            hash: Joi.string().required()
        }
    },
	handler: function(request, reply) {

		var fileName = request.params.hash;
		var filePath = (process.cwd() + '/uploads/') + fileName;
		// Check if the file exists
		fs.access(filePath, function(nonExistent) {
			if(nonExistent)
				return reply({ 'error': 'Image not found' }).code(404);
			var fd = fs.createReadStream(filePath);
			// Let reply() handle the stream
			return reply(fd);
		});

	}
};

