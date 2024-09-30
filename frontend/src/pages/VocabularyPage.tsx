import React, { useEffect, useState } from "react";

import TemplatePage from "../layout/TemplatePage";
import { ScreenEnum } from "../components/ui/Navbar";
import Title from "../components/ui/Title";
import requester from "../utils/requester";
import Loading from "../components/ui/Loading";
import QuizSection, { QuestionsType } from "../components/features/exercises/QuizSection";

type VocabularyPageProps = {};

const VocabularyPage: React.FC<VocabularyPageProps> = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsType>([]);

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      const response = await requester.get<QuestionsType>(
        "/exercise/vocabulary"
      );
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
      setQuestions([]);
      setIsLoading(false);
    };
  }, []);

  return (
    <TemplatePage screen={ScreenEnum.VocabularyPage}>
      <Title text="VocabularyPage" />
      {isLoading ? (
        <Loading />
      ) : (
        <QuizSection
          questions={questions}
          endpointAnswers="/exercise/vocabulary/answers"
          prefixStart="What is the English translation of the word : "
          prefixEnd=" ?"
        />
      )}
    </TemplatePage>
  );
};

export default VocabularyPage;
