import pandas as pd
import numpy as np
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "../../../data/processed/cleaned_sales_data.csv")

class ForecastService:
    def __init__(self):
        try:
            if os.path.exists(DATA_PATH):
                self.df = pd.read_csv(DATA_PATH)
                self.df['Date'] = pd.to_datetime(self.df['Date'])
            else:
                self.df = pd.DataFrame(columns=['Date', 'Total_Revenue'])
        except Exception as e:
            print(f"Error loading initial data: {e}")
            self.df = pd.DataFrame(columns=['Date', 'Total_Revenue'])

    def get_predictions(self, days: int = 30):
        if self.df is None or self.df.empty:
            return []
        
        # Get the target column name dynamically (whatever user uploaded)
        target_col = [col for col in self.df.columns if col != 'Date'][0]
        
        # Sort by date
        df_sorted = self.df.sort_values('Date')
        last_date = df_sorted['Date'].max()
        
        # Calculate a stable trend from the uploaded data
        recent_data = df_sorted.tail(30)[target_col]
        avg_val = recent_data.mean()
        trend = (recent_data.iloc[-1] - recent_data.iloc[0]) / len(recent_data) if len(recent_data) > 1 else 0

        predictions = []
        current_val = float(recent_data.iloc[-1])

        for i in range(1, days + 1):
            next_date = last_date + pd.Timedelta(days=i)
            # Add small realistic variance based on uploaded data distribution
            noise = np.random.normal(0, avg_val * 0.02)
            current_val = max(0, current_val + (trend * 0.5) + noise)
            
            predictions.append({
                "date": next_date.strftime('%Y-%m-%d'),
                "predicted_revenue": round(current_val, 2)
            })

        return predictions