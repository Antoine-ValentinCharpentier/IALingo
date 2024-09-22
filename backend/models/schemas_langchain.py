from langchain_core.pydantic_v1 import BaseModel, Field

from typing import Dict, List

# Vocabulary

class Vocabulary(BaseModel):
    word: str = Field(description="Un mot sur le thème donné")
    translated_word : str = Field(description="La traduction du mot")

class ExerciseVocabulary(BaseModel):
    words : List[Vocabulary] = Field(description="Une liste de mots avec leur traduction associé")

     
# Text 

class TextQuestion(BaseModel):
    question : str = Field(description="Une question portant sur l'article")
    right_answer : str = Field(description="La vraie réponse à la question basé sur l'article")
    bad_answers : List[str] = Field(description="Une liste de 3 mauvaise réponses à la question")
    
class ExerciseText(BaseModel):
    article: str = Field(description="Un article de plus de 200 mots sur lequel repose les questions")
    questions: List[TextQuestion] = Field(description="Une liste de trois questions qui porte sur l'article avec des réponses vraies et fausses")
      