#!/usr/bin/env python
"""
Full-stack startup script for Cloud Infrastructure Optimization System.
Starts both the FastAPI backend and React frontend.
"""

import os
import sys
import subprocess
import time
import threading
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_backend():
    """Run the FastAPI backend server."""
    try:
        logger.info("🚀 Starting FastAPI backend server...")
        
        # Change to project root directory
        project_root = Path(__file__).parent
        os.chdir(project_root)
        
        # Start the backend
        process = subprocess.run([
            sys.executable, "start.py"
        ], check=True)
        
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Backend failed to start: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        logger.info("🛑 Backend server stopped")

def run_frontend():
    """Run the React frontend development server."""
    try:
        # Wait a bit for backend to start
        time.sleep(3)
        
        logger.info("🎨 Starting React frontend development server...")
        
        # Change to frontend directory
        frontend_dir = Path(__file__).parent / "frontend"
        os.chdir(frontend_dir)
        
        # Check if node_modules exists
        if not (frontend_dir / "node_modules").exists():
            logger.info("📦 Installing frontend dependencies...")
            subprocess.run(["npm", "install"], check=True)
        
        # Start the frontend
        process = subprocess.run(["npm", "start"], check=True)
        
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Frontend failed to start: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        logger.info("🛑 Frontend server stopped")

def main():
    """Main function to start both servers."""
    logger.info("🏗️  Starting Cloud Infrastructure Optimization System")
    logger.info("=" * 60)
    
    try:
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=run_backend, daemon=True)
        backend_thread.start()
        
        # Wait a moment for backend to initialize
        time.sleep(5)
        
        # Start frontend (this will block)
        run_frontend()
        
    except KeyboardInterrupt:
        logger.info("\n🛑 Shutting down servers...")
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
