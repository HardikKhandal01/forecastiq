import pandas as pd
import numpy as np
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "../../../data/processed/cleaned_sales_data.csv")

class AnomalyService:
    def __init__(self):
        try:
            if os.path.exists(DATA_PATH):
                self.df = pd.read_csv(DATA_PATH)
                self.df['Date'] = pd.to_datetime(self.df['Date'])
            else:
                self.df = pd.DataFrame(columns=['Date', 'Total_Revenue'])
        except:
            self.df = pd.DataFrame(columns=['Date', 'Total_Revenue'])

    def detect_anomalies(self):
        if self.df is None or self.df.empty:
            return []
        
        target_col = [col for col in self.df.columns if col != 'Date'][0]
        
        # Statistical Z-Score Outlier Detection on uploaded data
        mean = self.df[target_col].mean()
        std = self.df[target_col].std()
        
        if std == 0 or pd.isna(std):
            return []

        anomalies = []
        for _, row in self.df.tail(60).iterrows():
            val = row[target_col]
            z_score = (val - mean) / std if std > 0 else 0
            
            if abs(z_score) > 1.5:
                severity = "Critical Outlier" if abs(z_score) > 2.5 else "Major Fluctuation" if abs(z_score) > 2.0 else "Minor Deviation"
                anomaly_type = "Unusual Spike 📈" if z_score > 0 else "Severe Drop 📉"
                
                anomalies.append({
                    "date": pd.to_datetime(row['Date']).strftime('%Y-%m-%d'),
                    "type": anomaly_type,
                    "severity": severity,
                    "revenue": round(val, 2)
                })
                
        return anomalies[::-1] # Most recent first