from ollama import Client

from langchain_ollama import ChatOllama
from langchain_core.output_parsers import PydanticOutputParser
from langchain.prompts.prompt import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field

from typing import List

from config import OLLAMA_BASE_URL, OLLAMA_MODEL_NAME
from services.prompts import PROMPT_EXERCISE_QCM

llm = ChatOllama(model=OLLAMA_MODEL_NAME, temperature=0.8, base_url=OLLAMA_BASE_URL)

class Question(BaseModel):
    word: str = Field(description="Un mot sur le thème donné")
    translated_word : str = Field(description="La traduction du mot")

class QCM(BaseModel):
    words : List[Question] = Field(description="Une liste de mots avec leur traduction associé")
      
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