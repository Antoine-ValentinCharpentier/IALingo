from fastapi import APIRouter, Request, HTTPException

import asyncio
import random

from pydantic import BaseModel
from typing import Dict

from services.llm import generate_qcm, generate_text
from services.utils import choose_values

router = APIRouter()

users_exercises = {}

class AnswersVocabularyRequest(BaseModel):
    answers: Dict[int, str]

@router.get("/vocabulary")
async def get_questions_vocabulary(request: Request):
    user_payload = getattr(request.state, "user", None)
    user_id = user_payload['sub']
    
    if (user_id in users_exercises) and ("vocabulary" in users_exercises[user_id]):
        dictionnary = users_exercises[user_id]['vocabulary']
    else:
        dictionnary = await asyncio.to_thread(generate_qcm)
        dictionnary = dictionnary.words
        if not user_id in users_exercises:
            users_exercises[user_id] = {}
        users_exercises[user_id]['vocabulary'] = dictionnary
    
    translated_words = [question.translated_word for question in dictionnary]
    data = [{"id": idx, "question": question.word, "answers": choose_values(translated_words, question.translated_word) } for idx, question in enumerate(dictionnary)]
    return data

@router.post("/vocabulary/answers")
async def get_questions_vocabulary(body: AnswersVocabularyRequest, request: Request):
    user_payload = getattr(request.state, "user", None)
    user_id = user_payload['sub']
    
    if (not user_id in users_exercises) or (not "vocabulary" in users_exercises[user_id]):
        raise HTTPException(status_code=400, detail="You need to generate a Quizz before trying to get its answers")
    
    answers = body.answers
    dictionnary = users_exercises[user_id]['vocabulary']
    
    correct_count =  sum(1 for idx_question, answer in answers.items() if dictionnary[idx_question].translated_word == answer)
    total_questions = len(answers.keys())
    mark = (correct_count / total_questions) * 10
    
    res_answers = {idx_question: dictionnary[idx_question].translated_word for idx_question in answers.keys()}
        
    del users_exercises[user_id]
    
    return {"mark": mark, "answers": res_answers}

@router.get("/text")
async def get_questions_vocabulary(request: Request):
    user_payload = getattr(request.state, "user", None)
    user_id = user_payload['sub']
    
    if (user_id in users_exercises) and ("text" in users_exercises[user_id]):
        text_with_questions = users_exercises[user_id]['text_with_questions']
    else:
        text_with_questions = await asyncio.to_thread(generate_text)

        if not user_id in users_exercises:
            users_exercises[user_id] = {}
            
        users_exercises[user_id]['text_with_questions'] = text_with_questions
    
    questions_shuffled = [{"id": idx, 
                       "question": question.question, 
                       "answers": random.sample(question.bad_answers + [question.right_answer], len(question.bad_answers) + 1)} 
                      for idx, question in enumerate(text_with_questions.questions)]
    
    return {"text": text_with_questions.text, "questions": questions_shuffled}