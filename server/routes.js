var User = require('./controllers/User');
var Event = require('./controllers/Event');
var Organize = require('./controllers/Organize');
var ClassUser = require('./controllers/ClassUser');


exports.endpoints = [
  { method: 'GET', path: '/user', config: User.getAll},
  { method: 'POST', path: '/user/log-in', config: User.logIn},
  { method: 'POST', path: '/user/sign-up', config: User.signUp},
  { method: 'GET', path: '/user/{id}', config: User.getUser},
  { method: 'GET', path: '/user/{id}/events', config: User.getUserEvents},
  { method: 'PUT', path: '/user/{id}/update', config: User.update},
  { method: 'PUT', path: '/user/{id}/update-avatar', config: User.updateAvatar},
  { method: 'PUT', path: '/user/{id}/change-password', config: User.changePassword},
  { method: 'GET', path: '/event', config: Event.getAll},
  { method: 'POST', path: '/event', config: Event.save},
  { method: 'PUT', path: '/event/{id}/update', config: Event.update},
  { method: 'DELETE', path: '/event/{id}/delete', config: Event.delete},
  { method: 'GET', path: '/classuser', config: ClassUser.getAll},
  { method: 'POST', path: '/classuser/log-in', config: ClassUser.logIn},
  { method: 'POST', path: '/classuser/sign-up', config: ClassUser.signUp},
  { method: 'GET', path: '/classuser/{id}', config: ClassUser.getUser},
  { method: 'GET', path: '/classuser/{id}/classes', config: ClassUser.getUserClasses},
  { method: 'GET', path: '/Organize', config: Organize.getAll},
  { method: 'POST', path: '/Organize', config: Organize.save},
  { method: 'DELETE', path: '/Organize/{id}/delete', config: Organize.delete},
];