from backend.app.services.forecasting_service import ForecastService

class WhatIfService:
    def __init__(self):
        # Baseline model ko load kar rahe hain
        self.forecast_service = ForecastService()

    def simulate_scenario(self, days=30, marketing_boost_pct=0.0, price_discount_pct=0.0):
        """
        Simulates how business levers affect the baseline AI forecast.
        """
        # 1. Get the normal AI baseline
        baseline_forecast = self.forecast_service.predict_future(days=days)
        
        # 2. Define Elasticity Rules (Real-world business logic)
        # Assuming every 1% increase in marketing boosts sales by 0.5%
        marketing_multiplier = 1 + (marketing_boost_pct / 100) * 0.5 
        
        # Assuming a 1% price discount increases volume by 1.5%, but reduces unit price
        # Net revenue effect = (1 - discount) * (1 + 1.5 * discount)
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