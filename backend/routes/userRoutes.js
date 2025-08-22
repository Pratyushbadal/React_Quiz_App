var express = require("express");

const {
  createUserController,
  loginHandleController,
  getUserListController,
  viewMyProfileController,
  updateProfileMeController,
  getMyQuizHistoryController,
} = require("../controller/userController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { uploadMiddleware } = require("../middleware/FileHandleMiddleware");
var router = express.Router();

router.post("/create", createUserController);
router.post("/login", loginHandleController);
router.get("/list", validateTokenMiddleware, getUserListController);

router.put(
  "/profile",
  validateTokenMiddleware,
  uploadMiddleware.single("profileImg"),
  updateProfileMeController
);

router.get("/profile/me", validateTokenMiddleware, viewMyProfileController);
// Corrected route to get the logged-in user's history
router.get("/history/me", validateTokenMiddleware, getMyQuizHistoryController);

module.exports = router;
