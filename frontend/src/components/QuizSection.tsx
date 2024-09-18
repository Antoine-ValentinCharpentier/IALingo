import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import requester from "../utils/requester";

import Button from "./Button";

import "../styles/components/QuizSection.css";

export type Question = {
  id: number;
  question: string;
  answers: string[];
};

export type QuestionsType = Question[];

type QuizSectionProps = {
  questions: QuestionsType;
  prefixStart?: string;
  prefixEnd?: string;
};

interface AnswersResponse {
  mark: number;
  answers: {
      [key: string]: string;
  };
}

const QuizSection: React.FC<QuizSectionProps> = ({
  questions = [],
  prefixStart = "",
  prefixEnd = "",
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [realAnswers, setRealAnswers] = useState<null | Record<number, string>>(
    null
  );

  const navigate = useNavigate();

  const handleAnswerChange = (id_question: number, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [id_question]: answer,
    });
  };

  const handleSubmit = async () => {
    console.log("Réponses sélectionnées :", selectedAnswers);

    const response = await requester.post<AnswersResponse>(
      "/exercise/vocabulary/answers",
      { answers: selectedAnswers }
    );
    if (!response.ok || !response.data) {
      console.error("Error while fetching vocabulary quizz answers !");
      return;
    }
    setRealAnswers(response.data.answers);
  };

  return (
    <div className="quizz">
      {questions.map((question, index) => (
        <div key={index} className="quizz-question">
          <h2 className="quizz-question-title">
            <span>{index + 1}.</span> {prefixStart}
            {question.question}
            {prefixEnd}
          </h2>
          <div className="quizz-question-answers">
            {question.answers.map((answer, ansIndex) => (
              <label
                key={ansIndex}
                className={
                  !!realAnswers
                    ? realAnswers[question.id] === answer
                      ? "correct-answer"
                      : selectedAnswers[question.id] === answer
                      ? "bad-answer"
                      : ""
                    : ""
                }
              >
                <input
                  disabled={!!realAnswers}
                  type="radio"
                  name={`question-${index}`}
                  value={answer}
                  checked={selectedAnswers[question.id] === answer}
                  onChange={() => handleAnswerChange(question.id, answer)}
                />
                {answer}
              </label>
            ))}
          </div>
        </div>
      ))}
      {realAnswers === null ? (
        <Button
          text="Submit"
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length < questions.length}
          additionalClass="btn-submit"
        />
      ) : (
        <Button
          text="Go to Home Page"
          onClick={() => navigate("/")}
          additionalClass="btn-submit"
        />
      )}
    </div>
  );
};

export default QuizSection;
