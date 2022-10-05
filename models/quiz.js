const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const quizSchema = new Schema({
  quizName : {
    type : String,
    required : true,
    unique : true,
    },
  subject : {
    type : String,
    required : true
  },
  topics : {
    type : [
    // topicName : String
    // questions : [{
    //  questionText : String,
    //  correctAnswer : String,
    //  incorrectAnswers : [String, ...]
    // }]
    ],
    required : true
  }
});

module.exports = model("Quiz", quizSchema);