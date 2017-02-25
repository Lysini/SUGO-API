var User = require('./controllers/User');
var Event = require('./controllers/Event');
var Image = require('./controllers/ImageUpload');


exports.endpoints = [
  { method: 'GET', path: '/user', config: User.getAll},
  { method: 'POST', path: '/user/log-in', config: User.logIn},
  { method: 'POST', path: '/user/sign-up', config: User.signUp},
  { method: 'GET', path: '/user/{id}', config: User.getUser},
  { method: 'GET', path: '/user/{id}/events', config: User.getUserEvents},
  { method: 'PUT', path: '/user/{id}/update', config: User.update},
  { method: 'PUT', path: '/user/{id}/update-avatar', config: User.updateAvatar},
  { method: 'POST', path: '/image/upload', config: Image.imageUpload},
  { method: 'GET', path: '/image/get/{hash}', config: Image.imageGet},
  { method: 'PUT', path: '/user/{id}/change-password', config: User.changePassword},
  { method: 'GET', path: '/event', config: Event.getAll},
  { method: 'POST', path: '/event', config: Event.save},
  { method: 'PUT', path: '/event/{id}/update', config: Event.update},
  { method: 'DELETE', path: '/event/{id}/delete', config: Event.delete},
];