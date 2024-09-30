import React from "react";
import { QuestionType } from "./QuizSection";

import "../../../assets/styles/components/features/exercices/Question.css";

type QuestionProps = {
  numQuestion: number;
  prefixStart: string;
  prefixEnd: string;
  question: QuestionType;
  handleAnswerChange: (questionId: number, answer: string) => void;
  realAnswers: string | undefined;
  selectedAnswer: string;
};

const Question: React.FC<QuestionProps> = ({
  numQuestion,
  prefixStart,
  prefixEnd,
  question,
  handleAnswerChange,
  realAnswers,
  selectedAnswer,
}) => {
  return (
    <div className="quizz-question">
      <h2 className="quizz-question-title">
        <span>{numQuestion}.</span> {prefixStart}
        {question.question}
        {prefixEnd}
      </h2>
      <div className="quizz-question-answers">
        {question.answers.map((answer, ansIndex) => (
          <label
            key={ansIndex}
            className={
              !!realAnswers
                ? realAnswers === answer
                  ? "correct-answer"
                  : selectedAnswer === answer
                  ? "bad-answer"
                  : ""
                : ""
            }
          >
            <input
              disabled={!!realAnswers}
              type="radio"
              name={`question-${numQuestion}`}
              value={answer}
              checked={selectedAnswer === answer}
              onChange={() => handleAnswerChange(question.id, answer)}
            />
            {answer}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Question;
