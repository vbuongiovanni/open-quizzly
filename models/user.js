const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const userSchema = new Schema({
  userName : {
    type : String,
    unique : true,
    required : true
  },
    password : {
    type : String,
    required : true
  },
  results : [{
    // quizName : String
    // quizId : String
    // subject : String
    // questions : [{
    //  topic : String,
    //  questionText : String,
    //  questionNumber : Number, // note that this will be created by Client
    //  userAnswer : String, // note that this will be created by Client
    //  dateAnswer : Date, // note that this will be created by Client
    //  correctAnswer : String,
    //  incorrectAnswers : [String, ...]
    // }]
  }]
});
module.exports = model("user", userSchema);