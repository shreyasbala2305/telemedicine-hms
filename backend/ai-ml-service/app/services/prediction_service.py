from app.schemas.prediction_request import PredictionRequest
from app.schemas.prediction_response import (
    ContributingFactor,
    PredictionResponse,
)


MODEL_VERSION = "baseline-0.1.0"


def generate_prediction(
    request: PredictionRequest,
) -> PredictionResponse:

    features = request.features

    contributing_factors = []

    if features.recurring_symptom_count > 0:
        contributing_factors.append(
            ContributingFactor(
                name="recurring_symptom_count",
                value=float(features.recurring_symptom_count),
                contribution=0.0,
                direction="neutral",
            )
        )

    if features.recent_appointment_count > 0:
        contributing_factors.append(
            ContributingFactor(
                name="recent_appointment_count",
                value=float(features.recent_appointment_count),
                contribution=0.0,
                direction="neutral",
            )
        )

    return PredictionResponse(
        patient_id=request.patient_id,
        prediction="INSUFFICIENT_MODEL_DATA",
        confidence=0.0,
        model_version=MODEL_VERSION,
        contributing_factors=contributing_factors,
        disclaimer=(
            "This output is for clinical decision support only "
            "and is not a medical diagnosis."
        ),
    )