# Import the GLOBAL instance so everyone shares the exact same live data!
from backend.app.api.routes.forecasting import forecast_service

class WhatIfService:
    # __init__ hata diya kyunki ab hum global forecast_service use karenge

    def simulate_scenario(self, days=30, marketing_boost_pct=0.0, price_discount_pct=0.0):
        """
        Simulates how business levers affect the baseline AI forecast.
        """
        # 1. Get the normal AI baseline using the CORRECT method name
        baseline_forecast = forecast_service.get_predictions(days=days)
        
        # 2. Define Elasticity Rules (Real-world business logic)
        marketing_multiplier = 1 + (marketing_boost_pct / 100) * 0.5 
        
        d = price_discount_pct / 100
        discount_multiplier = (1 - d) * (1 + 1.5 * d)
        
        total_multiplier = marketing_multiplier * discount_multiplier

        # 3. Generate Scenario Data
        scenario_results = []
        
        for item in baseline_forecast:
            base_revenue = item["predicted_revenue"]
            
            # Apply multiplier with a tiny bit of random noise for realism
            simulated_revenue = base_revenue * total_multiplier
            
            scenario_results.append({
                "date": item["date"],
                "baseline_revenue": base_revenue,
                "simulated_revenue": round(simulated_revenue, 2),
                "revenue_difference": round(simulated_revenue - base_revenue, 2)
            })
            
        return scenario_results