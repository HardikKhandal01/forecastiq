import pandas as pd
import numpy as np
from pathlib import Path

# Paths setup
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_PATH = BASE_DIR / 'data' / 'processed' / 'cleaned_sales_data.csv'

class AnomalyService:
    def __init__(self):
        self.df = pd.read_csv(DATA_PATH)
        self.df['Date'] = pd.to_datetime(self.df['Date'])
        # Daily aggregate
        self.daily = self.df.groupby('Date')['Total_Revenue'].sum().reset_index().sort_values('Date')

    def detect_anomalies(self):
        # 1. Calculate 7-day rolling mean and standard deviation
        self.daily['Rolling_Mean'] = self.daily['Total_Revenue'].rolling(window=7).mean()
        self.daily['Rolling_Std'] = self.daily['Total_Revenue'].rolling(window=7).std()
        
        # 2. Fill NaN values for the first 6 days using backward fill
        self.daily = self.daily.bfill()
        
        # 3. Calculate Z-Score
        self.daily['Z_Score'] = (self.daily['Total_Revenue'] - self.daily['Rolling_Mean']) / self.daily['Rolling_Std']
        
        # 4. FIX: Use 0.5 threshold to catch even minor fluctuations
        anomalies = self.daily[abs(self.daily['Z_Score']) > 0.5].copy()
        
        # 5. Format and categorize output
        results = []
        for _, row in anomalies.iterrows():
            z = row['Z_Score']
            
            # AI categorizes severity automatically
            if abs(z) > 3.0: 
                severity = "Critical 🚨"
            elif abs(z) > 2.0: 
                severity = "Major ⚠️"
            else: 
                severity = "Minor ℹ️"
            
            anomaly_type = "Unusual Spike 📈" if z > 0 else "Severe Drop 📉"
            
            results.append({
                "date": row['Date'].strftime('%Y-%m-%d'),
                "revenue": round(row['Total_Revenue'], 2),
                "type": anomaly_type,
                "severity": severity,
                "score": round(abs(z), 2)
            })
            
        # Return sorted by date (newest first)
        return sorted(results, key=lambda x: x['date'], reverse=True)