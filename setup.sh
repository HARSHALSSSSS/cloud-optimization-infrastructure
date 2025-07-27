#!/bin/bash
# Cloud Infrastructure Optimization System - Quick Setup Script

echo "🌥️  Cloud Infrastructure Optimization System Setup"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8+${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+${NC}"
    exit 1
fi

if ! command_exists psql; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL 15+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are installed${NC}"

# Backend Setup
echo -e "\n${BLUE}Setting up backend...${NC}"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your database credentials${NC}"
fi

# Frontend Setup
echo -e "\n${BLUE}Setting up frontend...${NC}"
cd frontend

# Install npm dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

# Database Setup Instructions
echo -e "\n${BLUE}Database Setup Instructions:${NC}"
echo "1. Make sure PostgreSQL is running"
echo "2. Create database and user:"
echo "   psql -U postgres"
echo "   CREATE DATABASE cloud_optimization;"
echo "   CREATE USER cloud_user WITH PASSWORD 'your_secure_password';"
echo "   GRANT ALL PRIVILEGES ON DATABASE cloud_optimization TO cloud_user;"
echo "   \\q"
echo ""
echo "3. Update .env file with your database credentials"
echo ""
echo "4. Run database migrations:"
echo "   alembic upgrade head"
echo ""
echo "5. Seed database with sample data:"
echo "   python seed_data.py"

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo -e "\n${BLUE}To start the application:${NC}"
echo "1. Backend: uvicorn app.main:app --reload"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo -e "${BLUE}Access URLs:${NC}"
echo "• Frontend: http://localhost:5173"
echo "• Backend API: http://localhost:8000"
echo "• API Docs: http://localhost:8000/docs"
echo ""
echo -e "${GREEN}Happy optimizing! 🚀${NC}"
