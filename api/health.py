from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json

app = FastAPI(title="Car Price Health API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def check_model():
    candidates = [
        Path(__file__).resolve().parent / "model_params.json",
        Path.cwd() / "api" / "model_params.json",
        Path.cwd() / "model_params.json",
        Path("/var/task/api/model_params.json"),
        Path("/var/task/model_params.json"),
    ]
    for p in candidates:
        if p.exists():
            return True, None
    return False, "model_params.json not found"

loaded, err = check_model()

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy" if loaded else "degraded",
        "model_loaded": loaded,
        "error": err,
    }

