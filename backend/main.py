from fastapi import FastAPI, Security
from fastapi.middleware.cors import CORSMiddleware

from middlewares.auth import JWTBearer

from router.exercise import router as exercice_router 
from router.auth import router as auth_router 

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

PROTECTED = [Security(JWTBearer())]

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(exercice_router, prefix="/exercise", tags=["Exercise"], dependencies=PROTECTED)