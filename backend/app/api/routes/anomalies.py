from fastapi import APIRouter
from backend.app.services.anomaly_service import AnomalyService

router = APIRouter()
anomaly_service = AnomalyService()

@router.get("/detect")
async def get_anomalies():
    """
    API Endpoint to detect anomalous sales days in historical data.
    """
    anomalies = anomaly_service.detect_anomalies()
    return {
        "status": "success",
        "data": anomalies
    }