'use strict';

const mongoose = require('mongoose');
var Joi = require('joi');
var fs = require('fs');
var path = require('path');
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
                image: Joi.any()
                    .meta({ swaggerType: 'file' })
                    .description('image file')
            }
	},
	payload: {
		maxBytes: 3256000,
		output: 'stream'
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

		if(!request.payload.image)
			return sendFailure(400, 'Missing file');

		var uploadStream = request.payload.image;

		// A very quick and dirty way to check the file extension
		var fileExt = path.extname(uploadStream.hapi.filename).substr(1).toLowerCase();

		// Check the content type
		var contentType = uploadStream.hapi.headers['content-type'];
		// Store the file to te temp folder
		var tmpFileName = uuid.v4() + '.' + fileExt;
		var tmpFilePath = require('os').tmpdir() + '/' + tmpFileName;
		var fd = fs.createWriteStream(tmpFilePath);

		var digestHash;
		var dstream = digestStream('sha1', 'hex', function(digest) {
			console.log('W SRODKU ' + digest);
			digestHash = digest;
		});

		uploadStream.pipe(dstream).pipe(fd);
		
		setTimeout(function(){ 
			var newFileName = digestHash;
			var newFilePath = process.cwd() + '/uploads/' + newFileName;
			console.log(digestHash);


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
		 }, 1500);	 
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
		var filePath = process.cwd() + '/uploads/' + fileName;
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

