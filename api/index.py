from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
from pydantic import BaseModel, Field

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


def load_params():
    candidates = [
        Path(__file__).resolve().parent / "model_params.json",
        Path.cwd() / "api" / "model_params.json",
        Path.cwd() / "model_params.json",
        Path("/var/task/api/model_params.json"),
        Path("/var/task/model_params.json"),
    ]
    for p in candidates:
        if p.exists():
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)
    raise FileNotFoundError("model_params.json not found in candidate paths")


try:
    PARAMS = load_params()
    CATEGORIES = PARAMS["categories"]
    SCALER_MEAN = PARAMS["scaler_mean"]
    SCALER_SCALE = PARAMS["scaler_scale"]
    MODEL_COEF = PARAMS["model_coef"]
    MODEL_INTERCEPT = PARAMS["model_intercept"]
    model_loaded = True
    load_error = None
except Exception as e:
    model_loaded = False
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
@app.get("/health")
@app.get("/api/health")
@app.get("/api/index.py")
def health():
    return {
        "status": "healthy" if model_loaded else "degraded",
        "model_loaded": model_loaded,
        "message": "Used Car Price Prediction API",
        "error": load_error,
    }


@app.post("/")
@app.post("/api")
@app.post("/predict")
@app.post("/api/predict")
@app.post("/api/index.py")
def predict(car: CarInput):
    if not model_loaded:
        raise HTTPException(
            status_code=500,
            detail=f"Model parameters could not be loaded: {load_error}",
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

    # 1. Scale numerical features using StandardScaler parameters
    raw_num = [
        float(car.year),
        float(car.mileage),
        float(car.tax),
        float(car.mpg),
        float(car.engine_size),
    ]
    scaled_num = [
        (x - m) / s for x, m, s in zip(raw_num, SCALER_MEAN, SCALER_SCALE)
    ]

    # 2. OneHotEncode categorical features (drop='first')
    make_cats = CATEGORIES[0][1:]
    fuel_cats = CATEGORIES[1][1:]
    trans_cats = CATEGORIES[2][1:]

    encoded_make = [1.0 if resolved_make == cat else 0.0 for cat in make_cats]
    encoded_fuel = [1.0 if car.fuelType == cat else 0.0 for cat in fuel_cats]
    encoded_trans = [1.0 if car.transmission == cat else 0.0 for cat in trans_cats]

    # 3. Concatenate all features
    features = scaled_num + encoded_make + encoded_fuel + encoded_trans

    # 4. Dot product with LinearRegression coefficients + intercept
    prediction = MODEL_INTERCEPT + sum(c * x for c, x in zip(MODEL_COEF, features))

    return {
        "predicted_price": round(float(prediction), 2),
        "currency": "USD",
    }
