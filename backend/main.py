from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import joblib
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np

app = FastAPI(
    title="Car Price Prediction API",
    description="API for predicting used car prices using a trained regression model.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR/"models"

encoder = joblib.load(MODEL_DIR/"encoder.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
model = joblib.load(MODEL_DIR / "linear_model.pkl")

class CarInput(BaseModel):
    make: str = Field(..., min_length=1)
    fuelType: str = Field(..., min_length=1)
    transmission: str = Field(..., min_length=1)

    year: int = Field(..., ge=1990, le=2026)
    mileage: float = Field(..., ge=0)
    tax: float = Field(..., ge=0)
    mpg: float = Field(..., gt=0)
    engine_size: float = Field(..., gt=0)

@app.get("/")
def root():
    return{
        "message": "Used Car Price Prediction API",
        "status": "running"
    }

@app.get("/health")
def health():
    return{
        "status": "healthy",
        "model_loaded": True
    }

@app.post("/predict")
def predict(car: CarInput):
    make_map = {
        "audi": "audi",
        "bmw": "BMW",
        "ford": "Ford",
        "hyundai": "Hyundai",
        "skoda": "skoda",
        "toyota": "toyota",
        "vw": "vw",
        "volkswagen": "vw",
    }
    resolved_make = make_map.get(car.make.strip().lower(), car.make.strip())

    categorical_data = pd.DataFrame([{
        "Make": resolved_make,
        "fuelType": car.fuelType,
        "transmission": car.transmission
    }])

    numerical_data = pd.DataFrame([{
        "year": car.year,
        "mileage": car.mileage,
        "tax": car.tax,
        "mpg": car.mpg,
        "engineSize": car.engine_size
    }])

    encoded_data = encoder.transform(categorical_data)

    scaled_data = scaler.transform(numerical_data)

    X = np.concatenate([scaled_data, encoded_data], axis=1)

    prediction = model.predict(X)[0]

    return {
        "predicted_price": round(float(prediction), 2)
        "predicted_price": round(float(prediction), 2),
        "currency": "GBP"
    }