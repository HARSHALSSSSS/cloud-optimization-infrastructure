#!/usr/bin/env python
"""
Startup script for the Cloud Infrastructure Optimization API.
This script handles database setup, seeding, and server startup.
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are installed."""
    try:
        import fastapi
        import sqlalchemy
        import psycopg2
        import uvicorn
        logger.info("✓ All dependencies are installed")
        return True
    except ImportError as e:
        logger.error(f"✗ Missing dependency: {e}")
        logger.error("Please run: pip install -r requirements.txt")
        return False

def setup_database():
    """Set up the database and run migrations."""
    try:
        logger.info("Setting up database...")
        
        # Create database tables
        from app.database import engine
        from app.models.cloud_resource import Base
        Base.metadata.create_all(bind=engine)
        logger.info("✓ Database tables created")
        
        # Seed sample data
        logger.info("Seeding sample data...")
        from seed_data import create_sample_data
        create_sample_data()
        logger.info("✓ Sample data seeded")
        
        return True
    except Exception as e:
        logger.error(f"✗ Database setup failed: {e}")
        return False

def start_server():
    """Start the FastAPI server."""
    try:
        logger.info("Starting the API server...")
        logger.info("Server will be available at: http://localhost:8000")
        logger.info("API documentation at: http://localhost:8000/docs")
        
        # Start uvicorn server
        import uvicorn
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"✗ Failed to start server: {e}")
        return False

def main():
    """Main startup function."""
    logger.info("🚀 Starting Cloud Infrastructure Optimization API...")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        logger.error("Database setup failed. Please check your PostgreSQL connection.")
        logger.error("Make sure to update the DATABASE_URL in your .env file.")
        sys.exit(1)
    
    # Start server
    logger.info("🎉 Setup complete! Starting the API server...")
    start_server()

if __name__ == "__main__":
    main()
