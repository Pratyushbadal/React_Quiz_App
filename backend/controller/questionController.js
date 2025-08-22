const AnswerModel = require("../model/AnswerModel");
const QuestionSet = require("../model/QuestionSetModel");
const Profile = require("../model/ProfileModel");

async function listQuestionSetController(req, res) {
  try {
    const questionSet = await QuestionSet.aggregate([
      {
        $project: {
          title: 1,
          questionCount: { $size: { $ifNull: ["$questions", []] } },
          duration: 1, // Include duration in the projection
        },
      },
    ]);

    res.json({
      questionSet: questionSet,
    });
  } catch (error) {
    console.error("Error fetching question sets:", error);
    res.status(500).json({ message: "Error fetching question sets." });
  }
}

async function getQuestionSetController(req, res) {
  const { id } = req.params;
  try {
    const questionSet = await QuestionSet.findById(id).populate({
      path: "questions",
      select: "-choices.correctAnswer",
    });
    if (!questionSet) {
      return res.status(404).json({ message: "Question set not found" });
    }
    res.json(questionSet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question set" });
  }
}

async function getQuestionSetForAdminController(req, res) {
  const { id } = req.params;
  try {
    const questionSet = await QuestionSet.findById(id).populate("questions");
    if (!questionSet) {
      return res.status(404).json({ message: "Question set not found" });
    }
    res.json(questionSet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question set for admin" });
  }
}

async function saveAttemptedQuestionController(req, res) {
  const { questionSet: questionSetId, responses, timeTaken } = req.body;
  const { id: userId } = req.user;

  const existingAttempt = await AnswerModel.findOne({
    user: userId,
    questionSet: questionSetId,
  });
  if (existingAttempt) {
    return res
      .status(400)
      .json({ message: "You have already attempted this quiz." });
  }

  const questionSet = await QuestionSet.findById(questionSetId).populate(
    "questions"
  );
  if (!questionSet)
    return res.status(404).json({ message: "QuestionSet not found" });

  const result = (responses || []).reduce(
    (acc, current) => {
      const q = questionSet.questions.find(
        (qn) => String(qn._id) === String(current.questionId)
      );
      if (!q) return acc;

      const correctIds = new Set(
        q.choices.filter((c) => c.correctAnswer).map((c) => String(c._id))
      );

      const selectedIds = new Set(
        current.selectedChoiceIds.map((id) => String(id))
      );

      const isCorrect =
        correctIds.size === selectedIds.size &&
        [...correctIds].every((id) => selectedIds.has(id));

      acc.total += 1;
      if (isCorrect) {
        acc.score += 1;
      }
      return acc;
    },
    { score: 0, total: 0 }
  );

  const saveAnswerQuestion = new AnswerModel({
    questionSet: questionSetId,
    user: userId,
    responses,
    score: result.score,
    total: result.total,
    timeTaken,
  });

  await saveAnswerQuestion.save();
  return res.status(201).json({
    message: "Graded",
    data: {
      score: result.score,
      total: result.total,
    },
  });
}

module.exports = {
  listQuestionSetController,
  getQuestionSetController,
  getQuestionSetForAdminController,
  saveAttemptedQuestionController,
};
