from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from backend.app.core.database import Base

class ForecastLog(Base):
    __tablename__ = "forecast_logs"

    id = Column(Integer, primary_key=True, index=True)
    request_type = Column(String, default="sales_prediction")
    horizon_days = Column(Integer)
    status = Column(String, default="success")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))