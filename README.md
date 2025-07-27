# 🌥️ Cloud Infrastructure Optimization System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)

> **Professional-grade cloud infrastructure optimization system that analyzes resource utilization and provides intelligent cost-saving recommendations across AWS, Azure, and GCP.**

![Dashboard Preview](./frontend/public/dashboard-preview.png)

## 🚀 Features

### 📊 **Comprehensive Resource Analysis**
- **Multi-Cloud Support**: Analyze resources across AWS, Azure, and GCP
- **Real-time Monitoring**: Live utilization metrics (CPU, Memory, Storage)
- **Cost Tracking**: Detailed monthly cost analysis and breakdowns
- **Resource Categorization**: Compute, Storage, Database, and Cache resources

### 💡 **Intelligent Optimization Engine**
- **Smart Recommendations**: AI-powered cost optimization suggestions
- **Confidence Scoring**: High/Medium/Low confidence levels for recommendations
- **Multiple Optimization Types**:
  - **Downsizing**: Right-size over-provisioned instances (40-60% savings)
  - **Storage Optimization**: Optimize large storage volumes (20-40% savings)
  - **Resource Termination**: Identify unused resources (up to 80% savings)

### 🎨 **Premium Enterprise UI**
- **Glass Morphism Design**: Modern, professional interface
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Dashboard**: Sortable tables, advanced filtering, and search
- **Real-time Updates**: Live data synchronization with backend
- **Implementation Tracking**: Mark recommendations as completed

### 🔧 **Advanced Technical Features**
- **RESTful API**: Comprehensive FastAPI backend with OpenAPI documentation
- **Database Integration**: PostgreSQL with optimized queries
- **Error Handling**: Robust error handling and recovery mechanisms
- **Performance Optimized**: Fast loading with caching and optimization
- **Health Monitoring**: System health checks and monitoring endpoints

## 🏗️ Architecture

**Technology Stack**

**Backend:**
- **FastAPI** - High-performance Python web framework
- **PostgreSQL** - Robust relational database
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations

**Frontend:**
- **React 18** - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript superset
- **Vite** - Next-generation frontend tooling
- **Axios** - Promise-based HTTP client
- **Lucide React** - Beautiful & consistent icon toolkit

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL 15+** - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** - [Download Git](https://git-scm.com/downloads/)

## 🚀 Quick Start

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/cloud-optimization-system.git
cd cloud-optimization-system
```

### 2. **Database Setup**

**Install PostgreSQL** (if not already installed):

```bash
# Windows - Download from https://www.postgresql.org/download/windows/
# macOS
brew install postgresql
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Create Database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE cloud_optimization;
CREATE USER cloud_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cloud_optimization TO cloud_user;
\q
```

### 3. **Backend Setup**

```bash
# Navigate to project root
cd cloud-optimization-system

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env file with your database credentials
DATABASE_URL=postgresql://cloud_user:your_secure_password@localhost:5432/cloud_optimization
```

**Seed the Database:**

```bash
# Run database migrations
alembic upgrade head

# Seed with sample data
python seed_data.py
```

**Start Backend Server:**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. **Frontend Setup**

```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

![App Screenshot](screenshot1.png)
![App Screenshot](screenshot2.png)
![App Screenshot](screenshot3.png)

### 5. **Access the Application**

- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

## 📖 Usage Guide

### **Dashboard Overview**

1. **Summary Cards**: View key metrics including total resources, monthly costs, and potential savings
2. **Cloud Resources Table**: Analyze all resources with filtering, sorting, and search capabilities
3. **Optimization Recommendations**: Review cost-saving suggestions with implementation tracking

### **Key Interactions**

- **Filter Resources**: Use provider, type, and text search filters
- **Sort Data**: Click column headers to sort by any metric
- **Mark Implemented**: Click checkboxes to mark recommendations as completed
- **Refresh Data**: Use the refresh button to update information
- **View Details**: Hover over elements for additional information

### **Sample Data**

The system comes pre-loaded with realistic sample data:

**Over-provisioned Resources:**
- `web-server-1`: t3.xlarge, 15% CPU, 25% memory, $150/month
- `api-server-2`: m5.large, 12% CPU, 30% memory, $90/month
- `worker-3`: Standard_D2s_v3, 8% CPU, 20% memory, $70/month

**Well-utilized Resources:**
- `database-1`: m5.xlarge, 75% CPU, 85% memory, $180/month
- `cache-server`: n1-standard-2, 65% CPU, 70% memory, $50/month

**Storage Resources:**
- `backup-storage`: 1000GB volume, $100/month
- `log-storage`: 500GB volume, $75/month
- `database-storage`: 200GB volume, $25/month

## 🔗 API Endpoints

### **Core Endpoints**

- `GET /api/v1/resources` - Retrieve all cloud resources
- `GET /api/v1/recommendations` - Get optimization recommendations
- `GET /api/v1/resources/{id}` - Get specific resource details
- `GET /api/v1/resources/{id}/health` - Get resource health score
- `GET /api/v1/analytics/cost-summary` - Get cost analytics summary
- `GET /health` - System health check

### **Sample API Response**

```json
{
  "total_resources": 8,
  "total_monthly_cost": 740.0,
  "total_potential_savings": 160.0,
  "savings_percentage": 21.62,
  "recommendations": [
    {
      "resource_id": 1,
      "resource_name": "web-server-1",
      "current_cost": 150.0,
      "recommendation_type": "downsize",
      "description": "Over-provisioned instance with 15% CPU and 25% memory utilization",
      "recommended_action": "Downsize from t3.xlarge to a smaller instance type",
      "estimated_savings": 50.0,
      "confidence_level": "high",
      "implemented": false
    }
  ]
}
```

## 🧪 Testing

### **Backend Testing**

```bash
# Run API tests
python -m pytest tests/

# Test specific endpoint
curl http://localhost:8000/api/v1/resources

# Check API documentation
open http://localhost:8000/docs
```

### **Frontend Testing**

```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

## 📁 Project Structure

```
cloud-optimization-system/
├── app/                        # Backend application
│   ├── api/                   # API routes and endpoints
│   ├── models/                # Database models
│   ├── services/              # Business logic services
│   ├── schemas.py             # Pydantic schemas
│   ├── database.py            # Database configuration
│   └── main.py                # FastAPI application entry
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API integration
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   └── App.tsx            # Main application component
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── alembic/                   # Database migrations
├── tests/                     # Test files
├── requirements.txt           # Python dependencies
├── seed_data.py              # Database seeding script
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🔒 Security Considerations

- **Environment Variables**: Sensitive data stored in `.env` files
- **Database Security**: Proper user permissions and connection security
- **API Security**: Input validation and error handling
- **CORS Configuration**: Properly configured cross-origin requests

## 🚀 Deployment

### **Docker Deployment**

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### **Manual Deployment**

1. **Backend**: Deploy FastAPI using Gunicorn + Nginx
2. **Frontend**: Build and serve static files
3. **Database**: Use managed PostgreSQL service (AWS RDS, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Performance Metrics

- **API Response Time**: < 200ms for most endpoints
- **Frontend Load Time**: < 2s initial load
- **Database Queries**: Optimized with proper indexing
- **Memory Usage**: Efficient resource management

## 🐛 Troubleshooting

### **Common Issues**

**Database Connection Error:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Verify database exists
psql -U postgres -l
```

**Port Already in Use:**
```bash
# Kill process on port 8000
npx kill-port 8000

# Kill process on port 5173
npx kill-port 5173
```

**Module Not Found Error:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

