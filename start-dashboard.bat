@echo off
echo 🚀 Starting Cloud Infrastructure Optimization Dashboard
echo =========================================================

echo.
echo 📋 Checking Prerequisites...
py --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found. Please install Node.js with npm
    pause
    exit /b 1
)

echo ✅ All prerequisites available
echo.

echo 🏗️  Step 1: Installing Backend Dependencies...
echo ----------------------------------------
pip install -r requirements.txt

echo.
echo 🏗️  Step 2: Installing Frontend Dependencies...
echo ----------------------------------------
cd frontend
call npm install
cd ..

echo.
echo 🗄️  Step 3: Setting up Database...
echo --------------------------------
py -c "
from app.database import engine, Base
from app.models.cloud_resource import CloudResource
Base.metadata.create_all(bind=engine)
print('✅ Database tables created')
"

echo.
echo 🌱 Step 4: Seeding Sample Data...
echo --------------------------------
py seed_data.py

echo.
echo 🚀 Step 5: Starting Services...
echo --------------------------------
echo Starting backend server...
start "Backend API" py start.py

echo Waiting for backend to start...
timeout /t 5 /nobreak

echo Starting frontend server...
start "Frontend Dashboard" cmd /c "cd frontend && npm start"

echo.
echo 🎉 STARTUP COMPLETE!
echo ===================
echo.
echo 📊 Dashboard: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📖 API Docs: http://localhost:8000/docs
echo.
echo ⚠️  Note: Both services will open in separate windows
echo    Close those windows to stop the services
echo.
pause
