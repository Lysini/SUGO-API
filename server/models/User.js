var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    match: /^[a-zA-Z0-9]{3,30}$/,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
  	type: String
  },
  age: {
    type: Number
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event'
  }]
});

UserSchema.pre('save', function(next) {
    var User = this;

  // only hash the password if it has been modified (or is new)
 
  if (!User.isModified('password')) return next();
        // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(User.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            User.password = hash;
            next();
        });
    });
}); 


UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema, 'User');