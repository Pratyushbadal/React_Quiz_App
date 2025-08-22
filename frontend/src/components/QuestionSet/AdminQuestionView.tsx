import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface IAdminQuestionSet {
  title: string;
  questions: {
    questionText: string;
    choices: {
      text: string;
      correctAnswer: boolean;
    }[];
  }[];
}

function AdminQuestionView() {
  const { id } = useParams();
  const [questionSet, setQuestionSet] = useState<IAdminQuestionSet | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get(`http://localhost:3000/api/questions/set/admin/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setQuestionSet(response.data);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (!questionSet) return <p>Question set not found.</p>;

  return (
    <div className="form-layout" style={{ maxWidth: "800px" }}>
      <h1 className="page-title">{questionSet.title}</h1>
      {questionSet.questions.map((q, qIndex) => (
        <div key={qIndex} className="question-card">
          <p>
            <strong>{q.questionText}</strong>
          </p>
          <ul style={{ listStyle: "none", paddingLeft: "1rem" }}>
            {q.choices.map((c, cIndex) => (
              <li
                key={cIndex}
                style={{ color: c.correctAnswer ? "green" : "inherit" }}
              >
                {c.text} {c.correctAnswer && " (Correct Answer)"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AdminQuestionView;
