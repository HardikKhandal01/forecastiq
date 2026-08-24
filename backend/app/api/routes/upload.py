from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io

from backend.app.api.routes.forecasting import forecast_service
from backend.app.api.routes.anomalies import anomaly_service

router = APIRouter()
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max limit is 5MB.")
    
    try:
        df = pd.read_csv(io.BytesIO(contents))
        
        date_col, target_col = None, None
        for col in df.columns:
            if 'date' in col.lower() or df[col].dtype == 'object':
                try:
                    df[col] = pd.to_datetime(df[col])
                    date_col = col
                    break
                except:
                    continue
                    
        for col in df.columns:
            if col != date_col and pd.api.types.is_numeric_dtype(df[col]):
                target_col = col
                break
                
        if not date_col or not target_col:
            raise HTTPException(status_code=400, detail="Invalid columns. Need 1 Date and 1 Numeric column.")

        # Standardize columns
        df = df.rename(columns={date_col: 'Date', target_col: target_col})
        df = df.sort_values('Date')

        # Update Live Services In-Memory
        forecast_service.df = df
        anomaly_service.df = df
        
        return {
            "status": "success",
            "message": "Data ingested successfully.",
            "detected_target": target_col,
            "rows_processed": len(df)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))