'use strict';

const Hapi = require('hapi');
const Joi = require('joi');  

const server = new Hapi.Server();

const contacts = []; 

server.connection({  
    host: 'localhost',
    port: 8000
});

server.route({  
	method: 'GET',
	path: '/contacts',
    config: {
        cors: {
            origin: ['*']
        }
    },
	handler(request, reply) {
	   	reply({
	      contacts
	    });
	}
});

server.route({  
  method: 'POST',
  path: '/contacts',
  config: {
    cors: {
        origin: ['*']
    },
    validate: {
      payload: Joi.object({
        contact: Joi.object({
          name: Joi.string().required(),
          surname: Joi.string().required()
        }).required()
      })
    }
  },
  handler(request, reply) {
    const contact = request.payload.contact;
    contacts.push(contact);
    reply({contact}).code(201);
  }
});

server.start((err) => {  
    if (err) {
        throw err;
    }

    console.log(`Server running at ${server.info.uri}`);
});