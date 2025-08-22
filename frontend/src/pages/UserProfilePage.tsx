import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface IUserDetails {
  name: string;
  email: string;
  profilePicture?: string;
}

interface IQuizHistory {
  _id: string;
  questionSet: { title: string };
  score: number;
  total: number;
  submittedAt: string;
}

function UserProfilePage() {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);
  const [quizHistory, setQuizHistory] = useState<IQuizHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get(`http://localhost:3000/users/history/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setUserDetails(response.data.userDetails);
        setQuizHistory(response.data.quizHistory);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) return <p>Loading...</p>;
  if (!userDetails) return <p>User not found.</p>;

  return (
    <div>
      <div className="profile-header">
        {userDetails.profilePicture ? (
          <img
            src={`http://localhost:3000/${userDetails.profilePicture}`}
            alt={userDetails.name}
            className="profile-avatar"
          />
        ) : (
          <div className="profile-avatar-placeholder" />
        )}
        <div>
          <h1>{userDetails.name}</h1>
          <p>{userDetails.email}</p>
        </div>
      </div>

      <div className="history-section">
        <h2>Quiz History</h2>
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

export default UserProfilePage;
