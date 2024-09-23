import React, { useEffect, useState } from "react";

import TemplatePage from "./TemplatePage";
import { ScreenEnum } from "../components/Navbar";
import Title from "../components/Title";
import requester from "../utils/requester";
import Loading from "../components/Loading";
import QuizSection, { QuestionsType } from "../components/QuizSection";

import "../styles/pages/TextPage.css";

type TextPageProps = {};

type QuestionReading = {
  text: string;
  questions: QuestionsType;
};

const TextPage: React.FC<TextPageProps> = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionReading>({
    text: "",
    questions: [],
  });

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      const response = await requester.get<QuestionReading>("/exercise/text");
      setIsLoading(false);
      if (!response.ok || !response.data) {
        console.error(
          "Error while fetching questions. Please, refresh the page."
        );
        return;
      }
      setQuestions(response.data);
    }
    fetchQuestions();
    return () => {
      setQuestions({ text: "", questions: [] });
      setIsLoading(false);
    };
  }, []);

  return (
    <TemplatePage screen={ScreenEnum.TextPage}>
      <Title text="TextPage" />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h2 className="text-statement">Read the following text and answer the questions</h2>
          <p className="text">{questions.text}</p>
          <QuizSection
            questions={questions.questions}
            endpointAnswers="/exercise/text/answers"
          />
        </>
      )}
    </TemplatePage>
  );
};

export default TextPage;
