from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import joblib
from pydantic import BaseModel, Field
import numpy as np
import warnings

warnings.filterwarnings("ignore")

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
    allow_headers=["*"],
)


def find_model_dir() -> Path:
    candidates = [
        Path(__file__).resolve().parent / "models",
        Path(__file__).resolve().parent.parent / "models",
        Path.cwd() / "models",
        Path.cwd() / "api" / "models",
        Path("/var/task/models"),
        Path("/var/task/api/models"),
    ]
    for p in candidates:
        if (
            (p / "encoder.pkl").exists()
            and (p / "scaler.pkl").exists()
            and (p / "linear_model.pkl").exists()
        ):
            return p
    # Fallback to current file parent
    return Path(__file__).resolve().parent / "models"


MODEL_DIR = find_model_dir()

try:
    encoder = joblib.load(MODEL_DIR / "encoder.pkl")
    scaler = joblib.load(MODEL_DIR / "scaler.pkl")
    model = joblib.load(MODEL_DIR / "linear_model.pkl")
    models_loaded = True
except Exception as e:
    encoder = None
    scaler = None
    model = None
    models_loaded = False
    load_error = str(e)


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
@app.get("/api")
def root():
    return {
        "message": "Used Car Price Prediction API",
        "status": "running",
        "model_loaded": models_loaded,
    }


@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy" if models_loaded else "degraded",
        "model_loaded": models_loaded,
        "model_dir": str(MODEL_DIR),
    }


@app.post("/predict")
@app.post("/api/predict")
def predict(car: CarInput):
    if not models_loaded:
        raise HTTPException(
            status_code=500,
            detail=f"Model artifacts could not be loaded: {globals().get('load_error', 'Unknown error')}",
        )

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

    try:
        import pandas as pd

        categorical_data = pd.DataFrame(
            [
                {
                    "Make": resolved_make,
                    "fuelType": car.fuelType,
                    "transmission": car.transmission,
                }
            ]
        )

        numerical_data = pd.DataFrame(
            [
                {
                    "year": car.year,
                    "mileage": car.mileage,
                    "tax": car.tax,
                    "mpg": car.mpg,
                    "engineSize": car.engine_size,
                }
            ]
        )

        encoded_data = encoder.transform(categorical_data)
        scaled_data = scaler.transform(numerical_data)
    except ImportError:
        # Fallback to direct arrays if pandas is omitted to reduce serverless package size
        cat_raw = [[resolved_make, car.fuelType, car.transmission]]
        num_raw = [
            [
                float(car.year),
                float(car.mileage),
                float(car.tax),
                float(car.mpg),
                float(car.engine_size),
            ]
        ]
        encoded_data = encoder.transform(cat_raw)
        scaled_data = scaler.transform(num_raw)

    X = np.concatenate([scaled_data, encoded_data], axis=1)
    prediction = model.predict(X)[0]

    return {
        "predicted_price": round(float(prediction), 2),
        "currency": "USD",
    }

