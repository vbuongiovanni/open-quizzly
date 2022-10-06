const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const resultsSchema = new Schema({
  userId : {
    type : Schema.Types.ObjectId,
    required : true,
    ref : "User",
  },
  quizId : {
    type : Schema.Types.ObjectId,
    required : true,
    ref : "Quiz",
  },
  sessionId : {
    type : String,
    required : true
  },
  topicName : {
    type : String,
    required : true
  },
  questionText : {
    type : String,
  },
  questionNumber : {
    type : Number,
  },
  userAnswer : {
    type : String,
  },
  isCorrect : {
    type : Number
  },
  dateAnswer : {
    type : Date,
    default : Date.now,
  },
  correctAnswer : {
    type : String,
  },
  incorrectAnswers : [
    {
      type : String
    }
  ]
});
resultsSchema.pre("save", function(next) {
  const result = this;
  result.isCorrect = result.correctAnswer === result.userAnswer ? 1 : 0;
  next()
})

module.exports = model("Result", resultsSchema);