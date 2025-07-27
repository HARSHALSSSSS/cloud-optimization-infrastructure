# 🚀 MANUAL STARTUP GUIDE - Cloud Infrastructure Optimization Dashboard

## Prerequisites
- Python 3.8+ (✅ Confirmed: Python 3.10.2)
- Node.js 16+ (✅ Confirmed: v22.11.0) 
- npm (✅ Confirmed: 10.9.0)

## Step-by-Step Manual Startup

### 1. 🏗️ Install Backend Dependencies
```bash
cd c:\Users\Lenovo\Desktop\projecttt
pip install -r requirements.txt
```

### 2. 🏗️ Install Frontend Dependencies  
```bash
cd c:\Users\Lenovo\Desktop\projecttt\frontend
npm install
cd ..
```

### 3. 🗄️ Setup Database (if not already done)
```bash
cd c:\Users\Lenovo\Desktop\projecttt
py -c "
from app.database import engine, Base
from app.models.cloud_resource import CloudResource
Base.metadata.create_all(bind=engine)
print('Database tables created')
"
```

### 4. 🌱 Seed Sample Data (if not already done)
```bash
cd c:\Users\Lenovo\Desktop\projecttt
py seed_data.py
```

### 5. 🚀 Start Backend Server
**Open Terminal 1:**
```bash
cd c:\Users\Lenovo\Desktop\projecttt
py start.py
```
**Wait for:** "Application startup complete" message
**Backend will be available at:** http://localhost:8000

### 6. 🎨 Start Frontend Server  
**Open Terminal 2:**
```bash
cd c:\Users\Lenovo\Desktop\projecttt\frontend
npm start
```
**Wait for:** "Compiled successfully!" message
**Frontend will be available at:** http://localhost:3000

## 🎯 Access Points After Startup
- **📊 Main Dashboard:** http://localhost:3000
- **🔧 Backend API:** http://localhost:8000
- **📖 API Documentation:** http://localhost:8000/docs
- **🏥 Health Check:** http://localhost:8000/health

## 🛑 How to Stop
- **Backend:** Press `Ctrl+C` in Terminal 1
- **Frontend:** Press `Ctrl+C` in Terminal 2

## 🔧 Troubleshooting
- **Port 8000 busy:** Kill with `taskkill /f /im python.exe`
- **Port 3000 busy:** Kill with `taskkill /f /im node.exe`
- **Database issues:** Run `py debug_db.py` to check data
- **Frontend compile errors:** Delete `node_modules`, run `npm install` again

## 📊 Expected Results
After successful startup, you should see:
- **8 cloud resources** ($740/month total cost)
- **4 optimization recommendations** ($160 savings potential)
- **Professional enterprise dashboard** with all data visible
- **Interactive cost optimization features**
