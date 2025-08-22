const { mongoose } = require("mongoose");

const questionSetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      choices: [
        {
          text: {
            type: String,
            required: true,
          },
          correctAnswer: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
  duration: {
    type: Number,
    // required: true,
    default: 5,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const QuestionSet = mongoose.model("QuestionSet", questionSetSchema);
module.exports = QuestionSet;
