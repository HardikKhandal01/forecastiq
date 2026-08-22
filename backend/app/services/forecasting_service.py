import pandas as pd
import joblib
from pathlib import Path
from datetime import timedelta

# Paths setup
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
MODEL_PATH = BASE_DIR / 'backend' / 'app' / 'ml' / 'saved_models' / 'xgboost_sales_model.pkl'
DATA_PATH = BASE_DIR / 'data' / 'processed' / 'cleaned_sales_data.csv'

class ForecastService:
    def __init__(self):
        # Load the frozen AI model
        self.model = joblib.load(MODEL_PATH)
        
        # Load historical data to give the model its "past memory"
        self.df = pd.read_csv(DATA_PATH)
        self.df['Date'] = pd.to_datetime(self.df['Date'])
        self.daily = self.df.groupby('Date')['Total_Revenue'].sum().reset_index().sort_values('Date')

    def predict_future(self, days=30):
        """Generates future sales predictions iteratively (Autoregressive)."""
        # Get the last 7 days of actual sales to start the rolling chain
        history = self.daily.tail(7).copy()
        
        # Generate future dates
        last_date = history['Date'].iloc[-1]
        future_dates = [last_date + timedelta(days=i) for i in range(1, days + 1)]
        
        predictions = []
        current_history = history['Total_Revenue'].tolist()
        
        for date in future_dates:
            # Recreate features for the specific future date
            day_of_week = date.dayofweek
            month = date.month
            is_weekend = 1 if day_of_week >= 5 else 0
            
            # Extract memory features from the rolling history list
            lag_1 = current_history[-1]
            lag_7 = current_history[-7]
            rolling_mean_7 = sum(current_history[-7:]) / 7
            
            # Format exactly as the model expects
            X_future = pd.DataFrame([[day_of_week, month, is_weekend, lag_1, lag_7, rolling_mean_7]], 
                             columns=['Day_of_Week', 'Month', 'Is_Weekend', 'Lag_1', 'Lag_7', 'Rolling_Mean_7'])
            
            # Predict the revenue for this day
            pred_revenue = self.model.predict(X_future)[0]
            
            # Save the prediction result
            predictions.append({
                "date": date.strftime('%Y-%m-%d'), 
                "predicted_revenue": round(float(pred_revenue), 2)
            })
            
            # 🌟 PRO-LEVEL ML: Add this new prediction to the history so it becomes the 'Lag_1' for tomorrow!
            current_history.append(pred_revenue)
            
        return predictions