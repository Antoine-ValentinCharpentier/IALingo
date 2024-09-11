from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from dependencies.auth import has_access

from router.exercice import router as exercice_router 

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"], 
)

PROTECTED = [Depends(has_access)]

app.include_router(exercice_router, prefix="/exercise", tags=["Exercise"], dependencies=PROTECTED)