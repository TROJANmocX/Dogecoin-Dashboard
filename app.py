from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route to avoid 404
@app.get("/")
def read_root():
    return {"message": "🚀 FastAPI is running successfully!"}

# Prediction request model
class PredictionRequest(BaseModel):
    input: str

# POST /predict
@app.post("/predict")
async def predict(data: PredictionRequest):
    text = data.input
    prediction = len(text) * 0.42  # Dummy prediction logic
    return {"prediction": round(prediction, 4)}
