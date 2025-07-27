@echo off
echo 🌥️  Cloud Infrastructure Optimization System Setup
echo ==================================================

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)

REM Check PostgreSQL
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL 15+
    pause
    exit /b 1
)

echo ✅ All prerequisites are installed

echo.
echo Setting up backend...

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your database credentials
)

REM Frontend Setup
echo.
echo Setting up frontend...
cd frontend

REM Install npm dependencies
echo Installing Node.js dependencies...
npm install

cd ..

REM Database Setup Instructions
echo.
echo Database Setup Instructions:
echo 1. Make sure PostgreSQL is running
echo 2. Create database and user:
echo    psql -U postgres
echo    CREATE DATABASE cloud_optimization;
echo    CREATE USER cloud_user WITH PASSWORD 'your_secure_password';
echo    GRANT ALL PRIVILEGES ON DATABASE cloud_optimization TO cloud_user;
echo    \q
echo.
echo 3. Update .env file with your database credentials
echo.
echo 4. Run database migrations:
echo    alembic upgrade head
echo.
echo 5. Seed database with sample data:
echo    python seed_data.py

echo.
echo ✅ Setup complete!
echo.
echo To start the application:
echo 1. Backend: uvicorn app.main:app --reload
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Access URLs:
echo • Frontend: http://localhost:5173
echo • Backend API: http://localhost:8000
echo • API Docs: http://localhost:8000/docs
echo.
echo Happy optimizing! 🚀

pause
