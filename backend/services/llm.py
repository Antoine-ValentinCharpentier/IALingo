from ollama import Client

from langchain_ollama import ChatOllama
from langchain_core.output_parsers import PydanticOutputParser
from langchain.prompts.prompt import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field

from typing import List

from config import OLLAMA_BASE_URL, OLLAMA_MODEL_NAME
from services.prompts import PROMPT_EXERCISE_QCM, PROMPT_EXERCISE_TEXT

llm = ChatOllama(model=OLLAMA_MODEL_NAME, temperature=0.8, base_url=OLLAMA_BASE_URL)

class Question(BaseModel):
    word: str = Field(description="Un mot sur le thème donné")
    translated_word : str = Field(description="La traduction du mot")

class QCM(BaseModel):
    words : List[Question] = Field(description="Une liste de mots avec leur traduction associé")
 
class TextQuestion(BaseModel):
    question : str = Field(description="Une question portant sur le texte/article")
    right_answer : str = Field(description="La vraie réponse à la question basé sur le texte")
    bad_answers : List[str] = Field(description="Une liste de 3 mauvaise réponses à la question")
class ExerciseText(BaseModel):
    text: str = Field(description="Un long texte/article sur lequel repose les questions")
    questions: List[TextQuestion] = Field(description="Une liste de trois questions associé au texte/article avec des réponses vraies et fausses")
      
def generate_qcm():
    parser = PydanticOutputParser(pydantic_object=QCM)

    prompt_template = PromptTemplate(
        template=PROMPT_EXERCISE_QCM,
        input_variables=["language_a", "language_b", "theme", "number_words"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    chain = prompt_template | llm | parser
    
    questions = chain.invoke(input={"language_a": "Suédois", "language_b": "Anglais", "theme": "la maison", "number_words": 40})
    
    return questions

def generate_text() -> ExerciseText :
    parser = PydanticOutputParser(pydantic_object=ExerciseText)
    
    prompt_template = PromptTemplate(
        template=PROMPT_EXERCISE_TEXT,
        input_variables=["language", "theme"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    chain = prompt_template | llm | parser
    
    questions = chain.invoke(input={"language": "Suédois", "theme": "l'argent"})
    
    return questions