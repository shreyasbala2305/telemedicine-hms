from fastapi import FastAPI

from app.schemas.prediction_request import PredictionRequest
from app.schemas.prediction_response import PredictionResponse
from app.services.prediction_service import generate_prediction


app = FastAPI(
    title="HMS AI/ML Service",
    description=(
        "Machine learning inference service for the "
        "Telemedicine Hospital Management System."
    ),
    version="0.1.0",
)


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "ai-ml-service",
    }


@app.post(
    "/predict",
    response_model=PredictionResponse,
)
def predict(request: PredictionRequest):
    return generate_prediction(request)