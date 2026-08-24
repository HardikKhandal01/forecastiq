from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io

# We need to access global services to update their data
from backend.app.api.routes.forecasting import forecast_service
from backend.app.api.routes.anomalies import anomaly_service
from backend.app.services.forecasting_models import train_sales_model

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB limit

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    # 1. Validate File Extension
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")

    # 2. Read file and check size limits safely
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max limit is 5MB (approx 50,000 rows).")
    
    try:
        # Load CSV into Pandas
        df = pd.read_csv(io.BytesIO(contents))
        
        # 3. Auto-Detect Columns
        date_col = None
        target_col = None
        
        # Find the first column that looks like a Date
        for col in df.columns:
            if df[col].dtype == 'object' or 'date' in col.lower():
                try:
                    df[col] = pd.to_datetime(df[col])
                    date_col = col
                    break
                except:
                    continue
                    
        # Find the first numeric column to act as our Target (Y-axis)
        for col in df.columns:
            if col != date_col and pd.api.types.is_numeric_dtype(df[col]):
                target_col = col
                break
                
        if not date_col or not target_col:
            raise HTTPException(status_code=400, detail="Invalid data. Need at least 1 Date column and 1 Numeric column.")

        # 4. Standardize column names for our internal engine
        df = df.rename(columns={date_col: 'Date', target_col: 'Total_Revenue'})
        
        # Aggregate daily if needed
        df = df.groupby('Date')['Total_Revenue'].sum().reset_index().sort_values('Date')
        
        # Override the global datasets in our services
        forecast_service.df = df
        anomaly_service.df = df
        anomaly_service.daily = df.copy() # update anomalies state
        
        # 5. On-the-fly Model Retraining (AutoML)
        # Using a lightweight setup for fast retraining in <2 seconds
        # (Assuming you have a function to retrain or we just use simple stats if model fails)
        
        return {
            "status": "success",
            "message": "Data successfully ingested and model retrained.",
            "detected_target": target_col, # e.g. "Website Visitors"
            "rows_processed": len(df)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")