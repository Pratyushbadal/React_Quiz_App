import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

export interface IListQuestionSet {
  _id: string;
  title: string;
  questionCount: number;
}

function ListQuestionSet() {
  const [questionSets, setQuestionSet] = useState<IListQuestionSet[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { roleState } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchQuizzesAndHistory = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      try {
        const quizzesResponse = await axios.get(
          "http://localhost:3000/api/questions/set/list",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setQuestionSet(quizzesResponse?.data?.questionSet || []);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }

      // Only fetch history if the user is not an admin
      if (roleState !== "admin") {
        try {
          const historyResponse = await axios.get(
            "http://localhost:3000/users/history/me",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          setCompletedQuizzes(
            historyResponse?.data?.map((quiz) => quiz.questionSet._id) || []
          );
        } catch (error) {
          console.error("Error fetching quiz history:", error);
        }
      }
      setIsLoading(false);
    };
    fetchQuizzesAndHistory();
  }, [roleState]);

  if (isLoading) return <p>Loading...</p>;
  if (!questionSets.length) return <p>No question sets found.</p>;

  return (
    <div>
      <h1 className="page-title">Available Quizzes</h1>
      <ul className="item-list">
        {questionSets.map((question) => {
          const isCompleted = completedQuizzes.includes(question._id);
          const clickHandler = () => {
            if (roleState === "admin") {
              navigate(`/admin/questionset/view/${question._id}`);
            } else {
              navigate(`/questionset/${question._id}/attempt`);
            }
          };
          return (
            <li key={question._id} className="list-card">
              <div className="card-text">
                <strong>{question.title}</strong>
                <p>{question.questionCount} questions</p>
              </div>
              {/* START: Updated logic for admin view */}
              {roleState === "admin" ? (
                <button onClick={clickHandler} className="action-button">
                  View/Manage
                </button>
              ) : isCompleted ? (
                <span className="completed-tag">Completed</span>
              ) : (
                <button onClick={clickHandler} className="action-button">
                  Take Quiz
                </button>
              )}
              {/* END: Updated logic */}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListQuestionSet;
