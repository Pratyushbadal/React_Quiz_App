import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AttemptQuizForm, {
  type IAttemptQuestionForm,
} from "../../components/QuestionSet/AttemptQuizForm";

function AttemptQuizPage() {
  const { id } = useParams();
  const [questionSet, setQuestionSet] = useState<IAttemptQuestionForm | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !id) {
      setIsLoading(false);
      setError("You must be logged in or the quiz ID is missing.");
      return;
    }

    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/questions/set/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data) {
          setQuestionSet(response.data);
        }
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Failed to load quiz. It may not exist or an error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!questionSet) {
    return <p>Quiz not found.</p>;
  }

  return (
    <div>
      <AttemptQuizForm questionSet={questionSet} />
    </div>
  );
}

export default AttemptQuizPage;
