import React, { useEffect, useState } from "react";

import TemplatePage from "../layout/TemplatePage";
import { ScreenEnum } from "../components/ui/Navbar";
import Title from "../components/ui/Title";
import requester from "../utils/requester";
import Loading from "../components/ui/Loading";
import QuizSection, { QuestionsType } from "../components/features/exercises/QuizSection";

import "../assets/styles/pages/ReadingPage.css";

type ReadingPageProps = {};

type QuestionReading = {
  text: string;
  questions: QuestionsType;
};

const ReadingPage: React.FC<ReadingPageProps> = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionReading>({
    text: "",
    questions: [],
  });

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      const response = await requester.get<QuestionReading>("/exercise/reading");
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
            endpointAnswers="/exercise/reading/answers"
          />
        </>
      )}
    </TemplatePage>
  );
};

export default ReadingPage;
