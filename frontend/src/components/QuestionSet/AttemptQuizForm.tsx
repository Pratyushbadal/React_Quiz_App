import React, { useState, useEffect, useRef } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import axios from "axios";

export interface IAttemptQuestionForm {
  _id: string;
  title: string;
  questions: IQuestion[];
  duration: number;
  createdBy: string;
  __v: number;
}

export interface IQuestion {
  questionText: string;
  choices: IChoice[];
  _id: string;
}

export interface IChoice {
  label: string;
  text: string;
  _id: string;
  selected?: boolean;
}

function AttemptQuizForm({
  questionSet,
}: {
  questionSet: IAttemptQuestionForm;
}) {
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(questionSet.duration * 60);
  const methods = useForm({ defaultValues: questionSet });
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitButtonRef.current?.click();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const onSubmitHandler = (data: IAttemptQuestionForm) => {
    const accessToken = localStorage.getItem("accessToken");
    const timeTaken = questionSet.duration * 60 - timeLeft;
    const finalData = {
      questionSet: data._id,
      responses: data.questions.map((q) => ({
        questionId: q._id,
        selectedChoiceIds: q.choices
          .filter((c) => c.selected)
          .map((c) => c._id),
      })),
      timeTaken,
    };
    axios
      .post("http://localhost:3000/api/questions/answer/attempt", finalData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setResult(res.data.data))
      .catch((error) => {
        alert(
          error?.response?.data?.message ||
            "An error occurred during submission."
        );
      });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (result) {
    return (
      <div className="form-layout">
        <h2 className="page-title">Quiz Result</h2>
        <p>
          Your Score is {result.score || 0} out of {result.total || 0}.
        </p>
      </div>
    );
  }

  return (
    <div className="form-layout" style={{ maxWidth: "800px" }}>
      <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <h1 className="page-title">{questionSet.title}</h1>
          <CreateQuestions />
          <button type="submit" ref={submitButtonRef} className="form-button">
            Submit Answers
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

function CreateQuestions() {
  const { control, register } = useFormContext<IAttemptQuestionForm>();
  const { fields } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="question-card">
          <p>
            <strong>{field.questionText}</strong>
          </p>
          <CreateChoices questionIndex={index} />
        </div>
      ))}
    </div>
  );
}

function CreateChoices({ questionIndex }: { questionIndex: number }) {
  const { control, register } = useFormContext<IAttemptQuestionForm>();
  const { fields } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  return (
    <div
      style={{
        marginLeft: "1rem",
        borderLeft: "2px solid #eee",
        paddingLeft: "1rem",
      }}
    >
      {fields.map((field, index) => (
        <div key={field.id} className="choice-row">
          <input
            type="checkbox"
            {...register(
              `questions.${questionIndex}.choices.${index}.selected`
            )}
            id={`q${questionIndex}-c${index}`}
          />
          <label htmlFor={`q${questionIndex}-c${index}`}>{field.text}</label>
        </div>
      ))}
    </div>
  );
}

export default AttemptQuizForm;
