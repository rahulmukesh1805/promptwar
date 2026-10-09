import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "HealthBridge AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # AI and External Service Keys
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OCR_API_KEY: str = os.getenv("OCR_API_KEY", "")
    TRANSLATION_API_KEY: str = os.getenv("TRANSLATION_API_KEY", "")
    
    # Demo Mode: if True or if no API keys are present, realistic demo mode is used
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")

settings = Settings()
