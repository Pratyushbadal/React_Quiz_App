import axios from "axios";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";

export interface QuestionSetForm {
  title: string;
  duration: number; // Add duration field
  questions: {
    questionText: string;
    choices: { text: string; correctAnswer: boolean }[];
  }[];
}

function CreateQuestionSetForm() {
  const methods = useForm<QuestionSetForm>({
    defaultValues: {
      title: "",
      duration: 10, // Default duration to 10 minutes
      questions: [{ questionText: "", choices: [] }],
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmitHandler = (data: QuestionSetForm) => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .post("http://localhost:3000/api/admin/questionset/create", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => alert("Question Set Created Successfully"));
  };

  return (
    <div className="form-layout">
      <h1 className="page-title">Create Question Set</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="form-group">
            <label>Title</label>
            <input {...register("title", { required: "Title is required" })} />
            {errors.title && <p>{errors.title.message}</p>}
          </div>
          <div className="form-group">
            <label>Duration (in minutes)</label>
            <input
              type="number"
              {...register("duration", {
                required: "Duration is required",
                valueAsNumber: true,
              })}
            />
            {errors.duration && <p>{errors.duration.message}</p>}
          </div>
          <CreateQuestions />
          <div className="button-center">
            <button type="submit" className="grey-button">
              Create Set
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

function CreateQuestions() {
  const { control, register } = useFormContext<QuestionSetForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div>
      <h3>Questions</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="question-card">
          <div className="input-group">
            <input
              {...register(`questions.${index}.questionText`)}
              placeholder="Enter Question Text"
            />
            <button
              type="button"
              className="remove-button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
          <CreateChoices questionIndex={index} />
        </div>
      ))}
      <button
        type="button"
        className="grey-button"
        onClick={() => append({ questionText: "", choices: [] })}
      >
        Add Question
      </button>
    </div>
  );
}

function CreateChoices({ questionIndex }: { questionIndex: number }) {
  const { control, register } = useFormContext<QuestionSetForm>();
  const { fields, append, remove } = useFieldArray({
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
        <div key={field.id} className="input-group">
          <input
            type="checkbox"
            {...register(
              `questions.${questionIndex}.choices.${index}.correctAnswer`
            )}
            style={{ width: "auto" }}
          />
          <input
            {...register(`questions.${questionIndex}.choices.${index}.text`)}
            placeholder="Choice Text"
          />
          <button
            type="button"
            className="remove-button"
            onClick={() => remove(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <div className="button-group">
        <button
          type="button"
          className="red-button"
          onClick={() => append({ text: "", correctAnswer: false })}
        >
          Add Choice
        </button>
      </div>
    </div>
  );
}

export default CreateQuestionSetForm;
