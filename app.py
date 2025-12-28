import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    input: str

@app.get("/")
def read_root():
    return {"message": "🚀 Dogecoin AI Backend Online"}

@app.post("/predict")
async def predict(data: PredictionRequest):
    # Fetch real data from CoinGecko
    async with httpx.AsyncClient() as client:
        # Get 30 days of OHLC data
        response = await client.get(
            "https://api.coingecko.com/api/v3/coins/dogecoin/ohlc?vs_currency=usd&days=30"
        )
        if response.status_code != 200:
            return {"error": "Failed to fetch data", "prediction": 0, "history": []}
        
        ohlc_data = response.json()
    
    # Format data for frontend: [time, open, high, low, close]
    # CoinGecko returns [time, open, high, low, close] directly
    
    # Simple "AI" Prediction Logic
    # 1. Calculate Simple Moving Average (SMA) of last 5 closes
    recent_closes = [candle[4] for candle in ohlc_data[-5:]]
    avg_price = sum(recent_closes) / len(recent_closes)
    
    # 2. Determine trend & Error
    last_close = ohlc_data[-1][4]
    
    # Fake MAE calculation (Deviation from SMA)
    mae_value = abs(last_close - avg_price)
    
    # Trend Factor
    trend_factor = 1.02 if last_close > avg_price else 0.98
    
    # 3. Predict next price
    predicted_price = last_close * trend_factor
    
    # 4. Range Calculation
    range_low = predicted_price * 0.98
    range_high = predicted_price * 1.02

    formatted_history = [
        {
            "date": row[0], # timestamp in ms
            "open": row[1],
            "high": row[2],
            "low": row[3],
            "close": row[4],
            "volume": random.randint(100000, 1000000) # CoinGecko OHLC doesn't include volume, mocking it
        }
        for row in ohlc_data
    ]

    return {
        "prediction": round(predicted_price, 4),
        "current_price": last_close,
        "mae": round(mae_value, 5),
        "range_low": round(range_low, 4),
        "range_high": round(range_high, 4),
        "history": formatted_history,
        "action": "BULLISH BIAS" if trend_factor > 1 else "BEARISH LEAN"
    }
