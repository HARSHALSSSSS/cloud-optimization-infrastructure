from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from app.api.routes import router
from app.database import engine
from app.models.cloud_resource import Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    """
    # Startup
    logger.info("Starting Cloud Infrastructure Optimization API...")
    
    # Create database tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Cloud Infrastructure Optimization API...")

# Create FastAPI application
app = FastAPI(
    title="Cloud Infrastructure Optimization API",
    description="""
    A professional-grade API for analyzing cloud infrastructure resources and providing cost optimization recommendations.
    
    ## Features
    
    * **Resource Management**: Track and analyze cloud resources across multiple providers
    * **Cost Optimization**: Intelligent recommendations for reducing cloud costs
    * **Utilization Analysis**: Monitor CPU, memory, and storage utilization
    * **Multi-Cloud Support**: AWS, Azure, and GCP resources
    * **Real-time Analytics**: Comprehensive cost and performance analytics
    
    ## Optimization Intelligence
    
    The system implements sophisticated algorithms to identify:
    - Over-provisioned instances (CPU < 30% AND memory < 50%)
    - Underutilized storage volumes (> 500GB)
    - Potential cost savings with confidence levels
    
    Built for enterprise-grade scalability and performance.
    """,
    version="1.0.0",
    contact={
        "name": "Cloud Optimization Team",
        "email": "optimization@company.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for unhandled errors.
    """
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error occurred",
            "detail": "Please contact support if this issue persists"
        }
    )

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify API is running.
    """
    return {
        "status": "healthy",
        "message": "Cloud Infrastructure Optimization API is running",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Welcome to Cloud Infrastructure Optimization API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "resources": "/api/v1/resources",
            "recommendations": "/api/v1/recommendations",
            "cost_summary": "/api/v1/analytics/cost-summary"
        }
    }
