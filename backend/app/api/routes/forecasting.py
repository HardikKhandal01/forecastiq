from fastapi import APIRouter
from backend.app.services.forecasting_service import ForecastService

router = APIRouter()
forecast_service = ForecastService()

@router.get("/predict")
async def get_forecast(days: int = 30):
    """
    API Endpoint to predict future sales.
    Default is 30 days, but frontend can request 7, 30, or 90 days.
    """
    result = forecast_service.predict_future(days=days)
    return {
        "status": "success",
        "forecast_horizon_days": days,
        "predictions": result
    }