"""
ForecastIQ Core Application Entry Point
---------------------------------------
Handles CORS, API Routing, and Health Verification.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔗 Naya Forecasting Route Import kiya hai
from backend.app.api.routes import forecasting, anomalies, what_if, upload

# Initialize FastAPI App with metadata for Swagger UI
app = FastAPI(
    title="ForecastIQ API Engine",
    description="Enterprise Sales Prediction & Business Intelligence Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Cross-Origin Resource Sharing (CORS) Configuration
# Cross-Origin Resource Sharing (CORS) Configuration
# Changed to ["*"] to allow Vercel Frontend to communicate with Render Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE INITIALIZATION ---
from backend.app.core.database import engine, Base
from backend.app.models import database_models

# Ye line check karegi ki table exist karti hai ya nahi, aur agar nahi to create kar degi
Base.metadata.create_all(bind=engine)
# -------------------------------

# 🔗 AI Forecasting API ko app ke sath connect kiya
app.include_router(forecasting.router, prefix="/api/forecasting", tags=["Forecasting Models"])
app.include_router(anomalies.router, prefix="/api/anomalies", tags=["Advanced Analytics"])
app.include_router(what_if.router, prefix="/api/scenarios", tags=["What-If Analysis"])
app.include_router(upload.router, prefix="/api/data", tags=["Data Ingestion"])
@app.get("/", tags=["System"])
async def root():
    """Root endpoint to check server availability."""
    return {
        "platform": "ForecastIQ",
        "status": "active",
        "documentation": "/docs"
    }


@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Health check endpoint returning system metrics and operational state.
    """
    return {
        "status": "healthy",
        "service": "ForecastIQ Intelligence Layer",
        "version": "1.0.0",
        "database_connected": False,  
        "ml_engine_ready": True
    }