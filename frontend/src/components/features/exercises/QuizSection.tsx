import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import requester from "../../../utils/requester";

import Question from "./Question";
import Button from "../../form/Button";
import Popup from "../../form/Popup";

import "../../../assets/styles/components/features/exercices/QuizSection.css";

export type QuestionType = {
  id: number;
  question: string;
  answers: string[];
};

export type QuestionsType = QuestionType[];

type QuizSectionProps = {
  questions: QuestionsType;
  endpointAnswers: string;
  prefixStart?: string;
  prefixEnd?: string;
};

interface AnswersResponse {
  mark: number;
  answers: {
    [key: string]: string;
  };
}

function getFeedback(score: number): string {
  if (score < 0 || score > 10) {
    return "Invalid score. Please enter a score between 0 and 10.";
  }

  const feedbackMessages: { [key: number]: string[] } = {
    0: [
      "Don't be discouraged, every mistake is a chance to improve!",
      "Failure is part of the journey to success. Keep trying!",
      "Everyone starts somewhere. Don’t give up!",
      "It’s tough, but you can do better next time!",
    ],
    1: [
      "A small step forward! You can build from here.",
      "Good effort, but there's a lot more potential to unlock.",
      "You’re just getting started. Keep practicing!",
      "Nice try, but with more effort, you'll see big improvements.",
    ],
    2: [
      "You're moving in the right direction. Keep practicing!",
      "Good start, but you’re capable of more.",
      "You’ve made progress. Continue pushing yourself!",
      "Nice effort! Practice will take you further.",
    ],
    3: [
      "Not bad! A bit more practice and you'll see great results.",
      "You’re on the right track. Keep going!",
      "Good job! Focus a bit more and you’ll get there.",
      "You're improving steadily! Just a little more effort.",
    ],
    4: [
      "You're getting there! A bit more effort will go a long way.",
      "Solid progress! Keep up the good work.",
      "You're halfway there, keep pushing!",
      "Nice job! Consistency will get you further.",
    ],
    5: [
      "Great! You’ve reached the halfway point. Now aim higher!",
      "Good progress! Keep building on this foundation.",
      "You're doing well, but there’s still room to grow.",
      "Halfway there! Just a bit more to reach excellence.",
    ],
    6: [
      "Good job! You’re above average, keep pushing forward.",
      "Nice work! You’ve got this, aim for even better.",
      "You're improving well. Stay focused and you'll excel!",
      "Great progress! You’re doing really well.",
    ],
    7: [
      "Well done! You’re getting close to mastering this.",
      "Great job! You're performing above expectations.",
      "Impressive! You’re on your way to excellence.",
      "You're doing really well, just a little more effort for perfection.",
    ],
    8: [
      "Fantastic work! You’re almost at the top.",
      "Great job! You're showing excellent understanding.",
      "Wonderful! Keep up this momentum and you’ll perfect it.",
      "Almost there! Just a bit more to reach full marks.",
    ],
    9: [
      "Amazing! You’re just one step away from perfection.",
      "Incredible work! You’re almost at the top.",
      "Fantastic! Just a small step and you’ll reach the max!",
      "You’re so close to perfection! Keep up the outstanding work.",
    ],
    10: [
      "Perfect score! You’ve mastered this completely.",
      "Flawless performance! You couldn’t have done better.",
      "Outstanding! You’ve achieved perfection.",
      "Perfect! You’ve hit the highest level of excellence.",
    ],
  };

  const feedbackList = feedbackMessages[Math.floor(score)];

  const randomFeedback =
    feedbackList[Math.floor(Math.random() * feedbackList.length)];

  return randomFeedback;
}

const QuizSection: React.FC<QuizSectionProps> = ({
  endpointAnswers,
  questions = [],
  prefixStart = "",
  prefixEnd = "",
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [realAnswers, setRealAnswers] = useState<null | AnswersResponse>(null);
  const [openPopupResult, setOpenPopupResult] = useState(false);

  const navigate = useNavigate();

  const handleAnswerChange = (id_question: number, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [id_question]: answer,
    });
  };

  const handleSubmit = async () => {
    const response = await requester.post<AnswersResponse>(endpointAnswers, {
      answers: selectedAnswers,
    });
    if (!response.ok || !response.data) {
      console.error("Error while fetching answers !");
      return;
    }
    setRealAnswers(response.data);
    setOpenPopupResult(true);
  };

  return (
    <div className="quizz">
      {questions.map((question, index) => (
        <Question
          numQuestion={index + 1}
          prefixStart={prefixStart}
          prefixEnd={prefixEnd}
          question={question}
          handleAnswerChange={handleAnswerChange}
          realAnswers={realAnswers?.answers[question.id]}
          selectedAnswer={selectedAnswers[question.id]}
        />
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
      {openPopupResult && realAnswers !== null && (
        <Popup
          title="Results"
          onClosePopup={() => setOpenPopupResult(false)}
          footer={
            <>
              <Button
                text="Look at the answers"
                onClick={() => setOpenPopupResult(false)}
                additionalClass="btn-submit"
              />
              <Button text="Go to home page" onClick={() => navigate("/")} />
            </>
          }
        >
          <div className="feedback">
            <p>{getFeedback(realAnswers?.mark)}</p>
            <p className="feedback-mark">{realAnswers?.mark.toFixed(1)}/10</p>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default QuizSection;
