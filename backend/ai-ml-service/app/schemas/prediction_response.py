from typing import List

from pydantic import BaseModel


class ContributingFactor(BaseModel):
    name: str
    value: float
    importance: float
    direction: str


class PredictionResponse(BaseModel):
    patient_id: int

    prediction: str

    confidence: float

    model_version: str

    contributing_factors: List[ContributingFactor]

    disclaimer: str