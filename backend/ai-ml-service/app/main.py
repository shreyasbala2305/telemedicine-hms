from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.prediction import router as prediction_router
from app.services.prediction_service import load_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


app = FastAPI(
    title="HMS AI/ML Service",
    description=(
        "Machine learning inference service for the "
        "Telemedicine Hospital Management System."
    ),
    version="0.1.0",
    lifespan=lifespan,
)


app.include_router(
    health_router,
)

app.include_router(
    prediction_router,
)