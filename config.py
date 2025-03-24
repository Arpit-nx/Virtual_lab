# config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

DEBUG = os.getenv("DEBUG", True) #Default to True if not found
PORT = int(os.getenv("PORT", 5000)) # Default to 5000 if not found

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/") # Default
DATABASE_NAME = os.getenv("DATABASE_NAME", "labsim") # Default