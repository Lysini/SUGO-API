var User = require('./controllers/User');
var Event = require('./controllers/Event');
var Class = require('./controllers/Class');
var ClassUser = require('./controllers/ClassUser');


exports.endpoints = [
  { method: 'GET', path: '/user', config: User.getAll},
  { method: 'POST', path: '/user/log-in', config: User.logIn},
  { method: 'POST', path: '/user/sign-up', config: User.signUp},
  { method: 'GET', path: '/user/{id}', config: User.getUser},
  { method: 'GET', path: '/user/profile/{login}', config: User.getUserProfile},
  { method: 'GET', path: '/user/{id}/events', config: User.getUserEvents},
  { method: 'PUT', path: '/user/{id}/update', config: User.update},
  { method: 'PUT', path: '/user/{id}/update-avatar', config: User.updateAvatar},
  { method: 'PUT', path: '/user/{id}/change-password', config: User.changePassword},

  { method: 'GET', path: '/event', config: Event.getAll},
  { method: 'GET', path: '/event/{id}', config: Event.getOne},
  { method: 'POST', path: '/event', config: Event.save},
  { method: 'PUT', path: '/event/{id}/update', config: Event.update},
  { method: 'DELETE', path: '/event/{id}/delete', config: Event.delete},


  { method: 'GET', path: '/classuser', config: ClassUser.getAll},
  { method: 'POST', path: '/classuser/log-in', config: ClassUser.logIn},
  { method: 'POST', path: '/classuser/sign-up', config: ClassUser.signUp},
  { method: 'GET', path: '/classuser/{id}', config: ClassUser.getUser},
  { method: 'GET', path: '/classuser/{id}/classes', config: ClassUser.getUserClasses},

  { method: 'GET', path: '/class', config: Class.getAll},
  { method: 'POST', path: '/class', config: Class.save},
  { method: 'PUT', path: '/class/{id}/update/{content}', config: Class.update},
  { method: 'DELETE', path: '/class/{id}/delete', config: Class.delete},
];