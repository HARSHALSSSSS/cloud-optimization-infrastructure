"""
Configuration settings for the Cloud Infrastructure Optimization API.
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings loaded from environment variables."""
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://username:password@localhost:5432/cloud_optimization")
    
    # API settings
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # Application metadata
    APP_NAME: str = "Cloud Infrastructure Optimization API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Professional-grade API for analyzing cloud infrastructure and optimizing costs"
    
    # Optimization settings
    CPU_THRESHOLD: float = float(os.getenv("CPU_THRESHOLD", "30.0"))
    MEMORY_THRESHOLD: float = float(os.getenv("MEMORY_THRESHOLD", "50.0"))
    STORAGE_SIZE_THRESHOLD: float = float(os.getenv("STORAGE_SIZE_THRESHOLD", "500.0"))
    STORAGE_OPTIMIZATION_RATE: float = float(os.getenv("STORAGE_OPTIMIZATION_RATE", "0.3"))
    
    # Security settings (for production)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALLOWED_HOSTS: list = os.getenv("ALLOWED_HOSTS", "*").split(",")
    
    # Logging settings
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

# Global settings instance
settings = Settings()
