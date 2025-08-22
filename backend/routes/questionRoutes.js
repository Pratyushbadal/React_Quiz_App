var express = require("express");
const {
  listQuestionSetController,
  getQuestionSetController,
  saveAttemptedQuestionController,
  getQuestionSetForAdminController,
} = require("../controller/questionController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { adminOnlyMiddleware } = require("../middleware/RoleMiddleware");
var router = express.Router();

router.get("/set/list", validateTokenMiddleware, listQuestionSetController);
router.get("/set/:id", validateTokenMiddleware, getQuestionSetController);

router.get(
  "/set/admin/:id",
  validateTokenMiddleware,
  adminOnlyMiddleware,
  getQuestionSetForAdminController
);

router.post(
  "/answer/attempt",
  validateTokenMiddleware,
  saveAttemptedQuestionController
);

module.exports = router;
