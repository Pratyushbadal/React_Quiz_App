import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "../App";

const availableSkills = [
  "JavaScript",
  "React",
  "Node",
  "Express",
  "HTML",
  "CSS",
  "MongoDB",
  "TypeScript",
  "GraphQL",
  "Python",
  "Java",
];

interface IQuizHistory {
  _id: string;
  questionSet: { title: string };
  score: number;
  total: number;
  submittedAt: string;
}

function ProfilePage() {
  const { setAuthState } = useContext(AuthContext);
  const [quizHistory, setQuizHistory] = useState<IQuizHistory[]>([]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const defaultValues = {
    name: "",
    bio: "",
    email: "",
    skills: [],
    profilePicture: "",
    github: "",
    linkedin: "",
    portfolioUrl: "",
    config: { mode: "view" },
  };

  const methods = useForm({ defaultValues });
  const { watch, reset, setValue, register, handleSubmit } = methods;

  const fetchProfile = () => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get("http://localhost:3000/users/profile/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        reset({ ...response.data, config: { mode: "view" } });
        // After fetching, update the global state as well
        setAuthState((prev) => ({
          ...prev,
          profilePicture: response.data.profilePicture,
        }));
      });
  };

  const fetchHistory = () => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get("http://localhost:3000/users/history/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setQuizHistory(response.data);
      });
  };

  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, []);

  const onUpdateHandler = async (formData) => {
    const accessToken = localStorage.getItem("accessToken");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    data.append("github", formData.github);
    data.append("linkedin", formData.linkedin);
    data.append("portfolioUrl", formData.portfolioUrl);
    formData.skills.forEach((skill) => data.append("skills", skill));

    if (profilePicture) {
      data.append("profileImg", profilePicture);
    }

    try {
      await axios.put("http://localhost:3000/users/profile", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  const data = watch();

  return (
    <div>
      <h1 className="page-title">My Profile</h1>
      <form onSubmit={handleSubmit(onUpdateHandler)}>
        {data.config.mode === "view" ? (
          <div className="profile-details">
            <div className="profile-grid">
              {/* --- Sidebar --- */}
              <div className="profile-sidebar">
                {data.profilePicture && (
                  <img
                    src={`http://localhost:3000/${data.profilePicture}`}
                    alt="Profile"
                  />
                )}
                <div className="profile-links">
                  {data.github && (
                    <a
                      href={data.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                  {data.linkedin && (
                    <a
                      href={data.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}
                  {data.portfolioUrl && (
                    <a
                      href={data.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Portfolio
                    </a>
                  )}
                </div>
              </div>

              {/* --- Main Content --- */}
              <div className="profile-main">
                <h2 className="profile-name">{data.name}</h2>
                <p className="profile-email">{data.email}</p>

                {data.bio && (
                  <div className="profile-section">
                    <h3>Bio</h3>
                    <p>{data.bio}</p>
                  </div>
                )}

                {Array.isArray(data.skills) && data.skills.length > 0 && (
                  <div className="profile-section">
                    <h3>Skills</h3>
                    <div className="skills-container">
                      {data.skills.map((skill) => (
                        <span key={skill} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="action-button"
                  onClick={() => setValue("config.mode", "edit")}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input {...register("name")} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input {...register("email")} />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea {...register("bio")} />
            </div>
            <div className="form-group">
              <label>GitHub URL</label>
              <input {...register("github")} />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input {...register("linkedin")} />
            </div>
            <div className="form-group">
              <label>Portfolio URL</label>
              <input {...register("portfolioUrl")} />
            </div>
            <div className="form-group">
              <label>Profile Picture</label>
              <input
                type="file"
                onChange={(e) =>
                  setProfilePicture(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
            <div className="skill-selector">
              <label>Skills</label>
              {availableSkills.map((skill) => (
                <div key={skill} className="skill-option">
                  <input
                    type="checkbox"
                    id={skill}
                    value={skill}
                    {...register("skills")}
                  />
                  <label htmlFor={skill}>{skill}</label>
                </div>
              ))}
            </div>
            <div className="button-group">
              <button
                type="button"
                className="grey-button"
                onClick={fetchProfile}
              >
                Cancel
              </button>
              <button type="submit" className="action-button">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="quiz-history">
        <h2 className="page-title" style={{ marginTop: "3rem" }}>
          Quiz History
        </h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {quizHistory.map((item) => (
              <tr key={item._id}>
                <td>{item.questionSet.title}</td>
                <td>
                  {item.score} / {item.total}
                </td>
                <td>{new Date(item.submittedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfilePage;
