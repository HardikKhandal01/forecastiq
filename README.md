# ForecastIQ 📈
> **Enterprise Sales Prediction & Business Intelligence Engine**

ForecastIQ bridges raw enterprise transaction logs with actionable time-series forecasting, automated cohort insights, and inventory decision support.

---

## 🏗️ Architecture Blueprint
* **Frontend:** React 18, TypeScript, TailwindCSS, Recharts / Plotly
* **Backend:** FastAPI (Async ASGI), Pydantic v2
* **ML & Analytics:** Pandas, NumPy, Statsmodels, Scikit-learn, XGBoost
* **Database:** PostgreSQL & SQLAlchemy (Structured metadata & historical runs)

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
# Activate Virtual Environment
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows

# Install Dependencies
pip install -r backend/requirements.txt

# Start Server
uvicorn backend.app.main:app --reload --port 8000

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev