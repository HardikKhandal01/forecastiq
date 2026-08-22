from fastapi import APIRouter, Query
from backend.app.services.what_if_service import WhatIfService

router = APIRouter()
what_if_service = WhatIfService()

@router.get("/simulate")
async def simulate_business_scenario(
    days: int = Query(30, description="Number of days to forecast"),
    marketing_boost: float = Query(0.0, description="Percentage increase in marketing spend"),
    discount: float = Query(0.0, description="Percentage of price discount offered")
):
    """
    Simulates revenue based on hypothetical business decisions.
    """
    results = what_if_service.simulate_scenario(
        days=days, 
        marketing_boost_pct=marketing_boost, 
        price_discount_pct=discount
    )
    
    # Calculate total impact
    total_baseline = sum(item["baseline_revenue"] for item in results)
    total_simulated = sum(item["simulated_revenue"] for item in results)
    
    return {
        "status": "success",
        "scenario_summary": {
            "total_baseline_revenue": round(total_baseline, 2),
            "total_simulated_revenue": round(total_simulated, 2),
            "net_impact": round(total_simulated - total_baseline, 2)
        },
        "daily_simulation": results
    }