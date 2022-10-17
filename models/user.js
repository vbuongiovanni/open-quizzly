const mongoose = require("mongoose");
const {Schema, model} = mongoose;
const bcrypt = require("bcrypt")

const userSchema = new Schema({
  username : {
    type : String,
    lowercase : true,
    unique : true,
    required : true
  },
    password : {
    type : String,
    required : true
  }
});

// presave hook to encrypt passwords on signup
userSchema.pre("save", function(next) {
  const user = this;
  // ensure bcrypt is only ran on initial signup
  if (!user.isModified("password")) {
    return next;
  }
  bcrypt.hash(user.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    user.password = hashedPassword;
    next();
  })
})

// check password on login
userSchema.methods.checkPassword = function(passwordAttempt, callback){
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    return callback(null, isMatch);
  });
}

userSchema.methods.removePassword = function(){
  const user = this.toObject();
  delete user.password;
  return user;
}

module.exports = model("User", userSchema);