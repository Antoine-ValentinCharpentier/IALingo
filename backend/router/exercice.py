from fastapi import APIRouter, Request

from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts.prompt import PromptTemplate

import os

router = APIRouter()

@router.get("")
async def get_exercise(request: Request):
    user_payload = getattr(request.state, "user", None)
    
    summary_template = """
        Raconte une blague sur le thème de : {theme}
    """
    
    summary_prompt_template = PromptTemplate(input_variables=["theme"], template=summary_template)
    
    llm = ChatOllama(model="llama3.1", temperature=1.0, base_url=os.getenv("OLLAMA_BASE_URL", "https://localhost:11434"))
    
    chain = summary_prompt_template | llm | StrOutputParser()
    
    theme = "Suédois"
    res = chain.invoke(input={"theme": theme})
    
    return {"user_payload": user_payload, "joke":res}