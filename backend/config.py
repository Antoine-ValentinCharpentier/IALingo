import os

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', "")
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', "http://localhost:3000")

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"

DATABASE_URL = os.getenv('DATABASE_URL', "sqlite:///./database.db")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "https://localhost:11434")
