# 📈 ForecastIQ Intelligence

**Empowering business leaders with enterprise-grade predictive analytics, automated sales forecasting, and interactive what-if scenarios.**

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Machine Learning](https://img.shields.io/badge/AI_Model-XGBoost%20%2B%20Pandas-FF6F00?style=for-the-badge&logo=python&logoColor=white)
![Deployment](https://img.shields.io/badge/Deployed_On-Vercel%20%26%20Render-black?style=for-the-badge)

---

## 🚀 Live Links
- **Backend (API Docs):** *(https://forecastiq-api-rcm3.onrender.com)*
- **Frontend (Live Dashboard):** *(https://forecastiq-two.vercel.app/)*

---

## 💡 About The Project
ForecastIQ is a full-stack AI-driven business intelligence platform. It moves beyond traditional static dashboards by incorporating a Machine Learning brain (XGBoost) that predicts future sales, automatically flags business anomalies, and allows managers to simulate "What-If" economic scenarios before making critical business decisions.

### 🔥 Key Features
1. **🤖 AI Baseline Forecasting:** Uses trained XGBoost models to predict sales revenue for the next 7, 30, or 90 days based on historical trends.
2. **🚨 Smart Anomaly Detection:** Automatically monitors historical and live data using Z-Score statistical methods to flag "Minor", "Major", or "Critical" business fluctuations (Unusual Spikes or Severe Drops).
3. **🎛️ What-If Scenario Simulator:** An interactive engine where business owners can adjust business levers (e.g., Marketing Spend, Price Discounts) via sliders to instantly visualize projected net impacts on revenue.
4. **📊 Interactive Mega-Dashboard:** A clean, dark-themed, highly responsive UI built with React, TailwindCSS, and Recharts.

---

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS (Styling)
- Recharts (Data Visualization)
- Lucide React (Icons)
- Axios (API Communication)

**Backend:**
- Python 3
- FastAPI (High-performance API framework)
- Pandas & NumPy (Data processing)
- Scikit-learn & XGBoost (Machine Learning)
- Joblib (Model persistence)

---

## 📁 Project Structure

```text
forecastiq/
│
├── backend/                  # FastAPI Backend & AI Models
│   ├── app/
│   │   ├── api/routes/       # API Endpoints (forecasting, anomalies, what_if)
│   │   ├── services/         # Core Logic & Engine
│   │   └── main.py           # Application Entry Point
│   ├── ml/                   # Machine Learning scripts & Saved Models
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React Vite Application
│   ├── src/
│   │   ├── components/       # Layouts, Sidebar, Header
│   │   ├── pages/            # Dashboard.tsx, HomePage.tsx
│   │   └── services/         # api.ts (Axios setup)
│   └── vercel.json           # Vercel SPA Routing config
│
└── data/                     # Datasets (Historical & Processed)
```

---

## ⚙️ Local Setup Instructions

Want to run this project locally? Follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/forecastiq.git](https://github.com/yourusername/forecastiq.git)
cd forecastiq
```

### 2. Setup Backend (FastAPI)
```bash
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment (Windows)
.venv\Scripts\activate

# Install required Python packages
pip install -r requirements.txt

# Start the FastAPI server
uvicorn backend.app.main:app --reload --port 8000
```
*Backend will be running at `http://127.0.0.1:8000`. You can access the interactive Swagger API documentation at `http://127.0.0.1:8000/docs`.*

### 3. Setup Frontend (React)
Open a new terminal window/tab:
```bash
# Navigate to the frontend directory
cd frontend

# Install Node modules
npm install

# Start the development server
npm run dev
```
*Frontend will be running at `http://localhost:5173`.*

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Checks system health and model readiness |
| `GET` | `/api/forecast/predict?days=30` | Returns baseline AI sales predictions |
| `GET` | `/api/scenarios/simulate` | Generates simulated revenue based on marketing/discount tweaks |
| `GET` | `/api/anomalies/detect` | Scans historical data for severe business outliers |

---

## 👨‍💻 Developer
Built from scratch with ❤️ by **Hardik**.