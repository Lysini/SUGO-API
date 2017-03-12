var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

var ClassUserSchema = new mongoose.Schema({
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
  classes: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class'
  }]
});

ClassUserSchema.pre('save', function(next) {
    var ClassUser = this;

  // only hash the password if it has been modified (or is new)
 
  if (!ClassUser.isModified('password')) return next();
        // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(ClassUser.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            ClassUser.password = hash;
            next();
        });
    });
}); 


ClassUserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('ClassUser', ClassUserSchema, 'ClassUser');