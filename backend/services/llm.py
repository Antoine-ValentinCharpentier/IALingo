from langchain_ollama import ChatOllama
from langchain_core.output_parsers import PydanticOutputParser
from langchain.prompts.prompt import PromptTemplate
from langchain.output_parsers import OutputFixingParser

from config import OLLAMA_BASE_URL, OLLAMA_MODEL_NAME
from services.prompts import PROMPT_EXERCISE_QCM, PROMPT_EXERCISE_TEXT
from models.schemas_langchain import ExerciseVocabulary, ExerciseText

llm = ChatOllama(model=OLLAMA_MODEL_NAME, temperature=0.8, base_url=OLLAMA_BASE_URL)

def generate_qcm() -> ExerciseVocabulary :
    initial_parser = PydanticOutputParser(pydantic_object=ExerciseVocabulary)
    
    parser = OutputFixingParser.from_llm(parser=initial_parser, llm=llm, max_retries=5)

    prompt_template = PromptTemplate(
        template=PROMPT_EXERCISE_QCM,
        input_variables=["language_a", "language_b", "theme", "number_words"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    chain = prompt_template | llm | parser
    
    questions = chain.invoke(input={"language_a": "Suédois", "language_b": "Anglais", "theme": "la maison", "number_words": 40})
    
    return questions

def generate_text() -> ExerciseText :
    initial_parser = PydanticOutputParser(pydantic_object=ExerciseText)
    
    parser = OutputFixingParser.from_llm(parser=initial_parser, llm=llm, max_retries=5)
    
    prompt_template = PromptTemplate(
        template=PROMPT_EXERCISE_TEXT,
        input_variables=["language", "theme"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    chain = prompt_template | llm | parser
    
    questions = chain.invoke(input={"language": "Suédois", "theme": "l'argent"}) 
    return questions