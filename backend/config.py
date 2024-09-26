import os

AUTH_SECRET_KEY = os.getenv("AUTH_SECRET_KEY", "")
AUTH_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', "")
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', "http://localhost:3000")

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"

DATABASE_URL = os.getenv('DATABASE_URL', "sqlite:///./database.db")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "https://localhost:11434")

OLLAMA_MODEL_NAME = "llama3.1"