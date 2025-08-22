const { mongoose } = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  bio: String,
  profilePicture: String,
  skills: [String],
  github: String,
  linkedin: String,
  portfolioUrl: String,
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
