import os
from dotenv import load_dotenv

# Load environment variables from .env file located at the root of the backend folder
load_dotenv()

class Settings:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    DEFAULT_AI_PROVIDER = os.getenv("AI_PROVIDER", "groq")
    APP_ENV = os.getenv("APP_ENV", "development")

settings = Settings()
