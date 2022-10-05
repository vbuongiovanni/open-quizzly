const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const resultsSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
    required : true,
    ref : "User",
  },
  quiz : {
    type : Schema.Types.ObjectId,
    required : true,
    ref : "Quiz",
  },
  questions : [{
    topic : String,
    questionText : String,
    questionNumber : Number,
    userAnswer : String,
    dateAnswer : Date,
    correctAnswer : String,
    incorrectAnswers : []
  }]
});
module.exports = model("Result", resultsSchema);