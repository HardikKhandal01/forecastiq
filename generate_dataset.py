import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_retail_data(start_date='2022-01-01', end_date='2024-01-01'):
    print("Generating synthetic enterprise dataset...")
    
    dates = pd.date_range(start=start_date, end=end_date, freq='D')
    
    # Business Logic Variables
    categories = {
        'Electronics': {'products': ['Laptop', 'Smartphone', 'Tablet'], 'price_range': (20000, 80000)},
        'Accessories': {'products': ['Headphones', 'Mouse', 'Keyboard'], 'price_range': (1000, 5000)},
        'Home Appliances': {'products': ['Microwave', 'Air Conditioner', 'Vacuum Cleaner'], 'price_range': (15000, 45000)}
    }
    regions = ['North', 'South', 'East', 'West']
    
    data = []
    transaction_id = 10001
    
    for current_date in dates:
        # Weekend and Seasonality Multipliers
        is_weekend = current_date.weekday() >= 5
        month = current_date.month
        
        # Festival boost (October/November for Diwali, December for Year-end)
        is_festive = month in [10, 11, 12]
        
        # Determine number of sales for the day
        daily_transactions = int(np.random.normal(loc=150, scale=30))
        if is_weekend:
            daily_transactions = int(daily_transactions * 1.5)
        if is_festive:
            daily_transactions = int(daily_transactions * 2.0)
            
        for _ in range(daily_transactions):
            category_name = random.choice(list(categories.keys()))
            product_name = random.choice(categories[category_name]['products'])
            region = random.choice(regions)
            store_id = f"STR_{region[:3].upper()}_{random.randint(1, 5)}"
            
            # Base logic for price and units
            base_price = random.randint(*categories[category_name]['price_range'])
            units = int(np.random.exponential(scale=2)) + 1
            
            # Discount logic
            discount = round(random.uniform(0.05, 0.25), 2) if is_festive else round(random.uniform(0.0, 0.1), 2)
            
            # Final calculation
            revenue = round((base_price * units) * (1 - discount), 2)
            
            data.append([
                transaction_id, current_date.strftime('%Y-%m-%d'), category_name, 
                product_name, region, store_id, base_price, units, discount, revenue
            ])
            transaction_id += 1
            
    df = pd.DataFrame(data, columns=[
        'Transaction_ID', 'Date', 'Category', 'Product', 
        'Region', 'Store_ID', 'Base_Price', 'Units_Sold', 
        'Discount_Applied', 'Total_Revenue'
    ])
    
    # Save to our RAW data folder
    output_path = 'data/raw/retail_sales_data.csv'
    df.to_csv(output_path, index=False)
    print(f"Success! Generated {len(df)} records.")
    print(f"File saved to: {output_path}")

if __name__ == "__main__":
    generate_retail_data()