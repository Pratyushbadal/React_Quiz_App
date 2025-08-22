const User = require("../model/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Profile = require("../model/ProfileModel");
const AnswerModel = require("../model/AnswerModel");

async function createUserController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const encryptPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: encryptPassword,
    });
    await user.save();

    const profile = new Profile({
      user: user._id,
      bio: "",
      profilePicture: "",
      skills: [],
      github: "",
      linkedin: "",
      portfolioUrl: "",
    });
    await profile.save();

    res.status(201).json({
      message: "User Created",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
}

async function loginHandleController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    const checkUser = await User.findOne({ email }).select("+password");
    if (!checkUser) {
      return res.status(400).json({
        message: "User with this email does not exist",
      });
    }

    const comparePassword = await bcrypt.compare(password, checkUser.password);
    if (comparePassword) {
      const token = jwt.sign(
        { id: checkUser._id, role: checkUser.role },
        process.env.AUTH_SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "Login Successful",
        accessToken: token,
      });
    } else {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error during login" });
  }
}

async function getUserListController(req, res) {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    const userListWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ user: user._id });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: profile ? profile.profilePicture : null,
        };
      })
    );
    res.status(200).json({ users: userListWithProfiles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user list" });
  }
}

async function getMyQuizHistoryController(req, res) {
  try {
    const { id: userId } = req.user;
    const history = await AnswerModel.find({ user: userId })
      .populate("questionSet", "title")
      .sort({ submittedAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz history" });
  }
}

async function updateProfileMeController(req, res) {
  try {
    const { id } = req.user;
    const { name, email, bio, skills, github, linkedin, portfolioUrl } =
      req.body;
    let profilePicturePath;
    if (req.file) {
      profilePicturePath = `uploads/profile/${req.file.filename}`;
    }

    await User.findByIdAndUpdate(id, { name, email });
    const profileUpdateData = { bio, skills, github, linkedin, portfolioUrl };
    if (profilePicturePath) {
      profileUpdateData.profilePicture = profilePicturePath;
    }
    await Profile.findOneAndUpdate({ user: id }, profileUpdateData);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
}

async function viewMyProfileController(req, res) {
  try {
    const { id } = req.user;
    const profile = await Profile.findOne({ user: id }).populate(
      "user",
      "name email"
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      name: profile.user.name,
      email: profile.user.email,
      bio: profile.bio,
      skills: profile.skills || [],
      profilePicture: profile.profilePicture,
      github: profile.github,
      linkedin: profile.linkedin,
      portfolioUrl: profile.portfolioUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
}

module.exports = {
  createUserController,
  loginHandleController,
  getUserListController,
  updateProfileMeController,
  viewMyProfileController,
  getMyQuizHistoryController,
};
