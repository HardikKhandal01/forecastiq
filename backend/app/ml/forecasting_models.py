import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
from pathlib import Path
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Paths setup
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
PROCESSED_DATA_PATH = BASE_DIR / 'data' / 'processed' / 'cleaned_sales_data.csv'
MODEL_SAVE_PATH = Path(__file__).resolve().parent / 'saved_models' / 'xgboost_sales_model.pkl'

class SalesForecaster:
    def __init__(self):
        self.model = xgb.XGBRegressor(n_estimators=200, learning_rate=0.05, random_state=42)
        self.features = ['Day_of_Week', 'Month', 'Is_Weekend', 'Lag_1', 'Lag_7', 'Rolling_Mean_7']
        self.target = 'Total_Revenue'
        
    def generate_features(self, df):
        """Creates the time-series features required by XGBoost."""
        print("⚙️ Generating Time-Series Features...")
        df_ts = df.copy()
        
        # Aggregate to daily
        daily = df_ts.groupby('Date')['Total_Revenue'].sum().reset_index()
        daily = daily.sort_values('Date')
        
        daily['Day_of_Week'] = daily['Date'].dt.dayofweek
        daily['Month'] = daily['Date'].dt.month
        daily['Is_Weekend'] = daily['Day_of_Week'].apply(lambda x: 1 if x >= 5 else 0)
        
        daily['Lag_1'] = daily['Total_Revenue'].shift(1)
        daily['Lag_7'] = daily['Total_Revenue'].shift(7)
        daily['Rolling_Mean_7'] = daily['Total_Revenue'].shift(1).rolling(window=7).mean()
        
        return daily.dropna()

    def train_and_save(self):
        """Trains the model on all available data and saves it for API consumption."""
        print(f"📥 Loading data from {PROCESSED_DATA_PATH}")
        df = pd.read_csv(PROCESSED_DATA_PATH)
        df['Date'] = pd.to_datetime(df['Date'])
        
        # Prepare Data
        df_processed = self.generate_features(df)
        X = df_processed[self.features]
        y = df_processed[self.target]
        
        # Train Model
        print("🧠 Training Production XGBoost Model. Please wait...")
        self.model.fit(X, y)
        
        # Save Model
        joblib.dump(self.model, MODEL_SAVE_PATH)
        print(f"✅ Model successfully saved at: {MODEL_SAVE_PATH}")
        
        # Quick validation metric
        predictions = self.model.predict(X)
        mae = mean_absolute_error(y, predictions)
        print(f"📊 Production Model In-Sample MAE: ₹{mae:,.2f}")

if __name__ == "__main__":
    forecaster = SalesForecaster()
    forecaster.train_and_save()