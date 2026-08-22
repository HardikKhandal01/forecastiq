import pandas as pd
import numpy as np
from pathlib import Path

# Automatically detect the project root folder (forecastiq)
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

class DataPreprocessor:
    """
    Enterprise Data Preprocessing Pipeline for ForecastIQ.
    Handles data ingestion, cleaning, feature extraction, and exporting.
    """
    
    def __init__(self, filename="retail_sales_data.csv"):
        self.raw_data_path = BASE_DIR / 'data' / 'raw' / filename
        self.processed_data_path = BASE_DIR / 'data' / 'processed' / 'cleaned_sales_data.csv'

    def run_pipeline(self):
        print(f"🔄 Loading raw data from: {self.raw_data_path}")
        
        try:
            df = pd.read_csv(self.raw_data_path)
        except FileNotFoundError:
            print("❌ Error: Raw data file not found! Please run Phase 2 first.")
            return None

        # 1. Data Type Validation & Conversion
        print("🛠️ Converting data types...")
        df['Date'] = pd.to_datetime(df['Date'])
        
        # 2. Missing Value Handling
        # In a real enterprise, discounts might be missing (assumed 0), or units might be NaN
        print("🧹 Handling missing values...")
        df['Discount_Applied'] = df['Discount_Applied'].fillna(0.0)
        df['Units_Sold'] = df['Units_Sold'].fillna(1)
        
        # Drop rows where critical business metrics are missing
        df = df.dropna(subset=['Total_Revenue', 'Date', 'Transaction_ID'])

        # 3. Basic Feature Engineering for Time-Series
        print("⚙️ Extracting time-series features...")
        df['Year'] = df['Date'].dt.year
        df['Month'] = df['Date'].dt.month
        df['Day_of_Week'] = df['Date'].dt.dayofweek # 0 = Monday, 6 = Sunday
        df['Is_Weekend'] = df['Day_of_Week'].apply(lambda x: 1 if x >= 5 else 0)

        # 4. Outlier Flagging (Optional but recommended for Business Intelligence)
        # Flag transactions that are more than 3 standard deviations away from mean revenue
        revenue_mean = df['Total_Revenue'].mean()
        revenue_std = df['Total_Revenue'].std()
        df['Is_Outlier'] = np.where(
            df['Total_Revenue'] > (revenue_mean + 3 * revenue_std), 1, 0
        )

        # Save the cleaned dataset
        print(f"💾 Saving processed data to: {self.processed_data_path}")
        df.to_csv(self.processed_data_path, index=False)
        
        print("✅ Pipeline Completed Successfully!")
        print(f"📊 Final Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
        
        return df

if __name__ == "__main__":
    # When running this script directly for testing
    preprocessor = DataPreprocessor()
    preprocessor.run_pipeline()