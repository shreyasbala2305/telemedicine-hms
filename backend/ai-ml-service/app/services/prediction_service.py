from pathlib import Path
from typing import Any

import joblib
import numpy as np

from app.config import (
    FEATURE_VERSION,
    MODEL_PATH,
    MODEL_VERSION,
)
from app.schemas.prediction_request import PredictionRequest
from app.schemas.prediction_response import (
    ContributingFactor,
    PredictionResponse,
)
from app.utils.feature_schema import (
    FEATURE_NAMES,
    feature_vector_from_named_features,
    validate_feature_vector,
)


DISCLAIMER = (
    "This output is for clinical decision support only "
    "and is not a medical diagnosis."
)


class ModelInferenceError(RuntimeError):
    """Raised when the ML model cannot perform inference."""


class ModelLoader:
    """
    Loads and validates the versioned ML model artifact.

    The persisted artifact contains both the trained estimator
    and metadata required to guarantee compatibility with the
    inference feature contract.
    """

    def __init__(self) -> None:
        self._model: Any | None = None
        self._metadata: dict[str, Any] = {}

    def load(self) -> None:
        """
        Load the model artifact once during application startup.
        """
        model_path = Path(MODEL_PATH)

        if not model_path.exists():
            raise ModelInferenceError(
                f"ML model artifact not found: {model_path}"
            )

        try:
            artifact = joblib.load(model_path)
        except Exception as exc:
            raise ModelInferenceError(
                "Unable to load the ML model artifact."
            ) from exc

        if not isinstance(artifact, dict):
            raise ModelInferenceError(
                "Invalid ML model artifact format. "
                "Expected a metadata dictionary."
            )

        model = artifact.get("model")

        if model is None:
            raise ModelInferenceError(
                "ML model artifact does not contain a 'model' entry."
            )

        self._model = model
        self._metadata = artifact

        self._validate_model()

    def _validate_model(self) -> None:
        """
        Validate the trained model and its metadata against
        the inference service contract.
        """
        if self._model is None:
            raise ModelInferenceError(
                "ML model has not been loaded."
            )

        if not hasattr(self._model, "predict"):
            raise ModelInferenceError(
                "Loaded ML model does not support prediction."
            )

        if not hasattr(self._model, "predict_proba"):
            raise ModelInferenceError(
                "Loaded ML model does not support probability prediction."
            )

        artifact_feature_version = self._metadata.get(
            "feature_version"
        )

        if artifact_feature_version != FEATURE_VERSION:
            raise ModelInferenceError(
                "ML model feature version mismatch: "
                f"expected {FEATURE_VERSION}, "
                f"received {artifact_feature_version}"
            )

        artifact_feature_names = self._metadata.get(
            "feature_names"
        )

        if artifact_feature_names != list(FEATURE_NAMES):
            raise ModelInferenceError(
                "ML model feature schema does not match "
                "the inference service."
            )

        artifact_model_version = self._metadata.get(
            "model_version"
        )

        if artifact_model_version != MODEL_VERSION:
            raise ModelInferenceError(
                "ML model version mismatch: "
                f"expected {MODEL_VERSION}, "
                f"received {artifact_model_version}"
            )

        artifact_classes = self._metadata.get("classes")

        model_classes = getattr(
            self._model,
            "classes_",
            None,
        )

        if (
            artifact_classes is None
            or model_classes is None
            or list(map(str, model_classes))
            != list(map(str, artifact_classes))
        ):
            raise ModelInferenceError(
                "ML model classes do not match "
                "the artifact metadata."
            )

    @property
    def model(self) -> Any:
        """
        Return the validated trained estimator.
        """
        if self._model is None:
            raise ModelInferenceError(
                "ML model has not been loaded."
            )

        return self._model

    def get_feature_importances(self) -> list[float]:
        """
        Return the trained model's global feature importances.

        These values describe overall feature importance in the
        trained Random Forest. They are not patient-specific
        prediction contributions.
        """
        if self._model is None:
            raise ModelInferenceError(
                "ML model has not been loaded."
            )

        importances = getattr(
            self._model,
            "feature_importances_",
            None,
        )

        if importances is None:
            return []

        if len(importances) != len(FEATURE_NAMES):
            raise ModelInferenceError(
                "ML model feature importance length does not "
                "match the inference feature schema."
            )

        return [
            float(value)
            for value in importances
        ]


model_loader = ModelLoader()


def load_model() -> None:
    """
    Public startup hook used by the FastAPI lifespan.
    """
    model_loader.load()


def _build_contributing_factors(
    feature_vector: list[float],
) -> list[ContributingFactor]:
    """
    Build the currently supported feature-importance output.

    Note:
    Random Forest feature_importances_ values represent global
    model importance, not patient-specific contributions.
    The response contract will be refined during the
    explainability phase.
    """
    importances = model_loader.get_feature_importances()

    if not importances:
        return []

    factors = []

    for name, value, importance in zip(
        FEATURE_NAMES,
        feature_vector,
        importances,
    ):
        if value == 0:
            continue

        factors.append(
            ContributingFactor(
                name=name,
                value=float(value),
                contribution=float(importance),
                direction=(
                    "positive"
                    if importance > 0
                    else "neutral"
                ),
            )
        )

    factors.sort(
        key=lambda factor: abs(
            factor.contribution
        ),
        reverse=True,
    )

    return factors[:5]


def generate_prediction(
    request: PredictionRequest,
) -> PredictionResponse:
    """
    Generate an ML prediction for a patient.

    The structured patient-health context is converted into
    the deterministic feature vector expected by the trained
    model.
    """
    feature_vector = feature_vector_from_named_features(
        request.features
    )

    validate_feature_vector(feature_vector)

    model = model_loader.model

    model_input = np.array(
        [feature_vector],
        dtype=float,
    )

    try:
        prediction = model.predict(
            model_input
        )[0]

        probabilities = model.predict_proba(
            model_input
        )[0]

    except Exception as exc:
        raise ModelInferenceError(
            "ML model inference failed."
        ) from exc

    classes = getattr(
        model,
        "classes_",
        None,
    )

    if (
        classes is None
        or len(classes) != len(probabilities)
    ):
        raise ModelInferenceError(
            "ML model classes are inconsistent "
            "with prediction probabilities."
        )

    class_probabilities = {
        str(label): float(probability)
        for label, probability in zip(
            classes,
            probabilities,
        )
    }

    confidence = max(
        class_probabilities.values()
    )

    contributing_factors = (
        _build_contributing_factors(
            feature_vector
        )
    )

    return PredictionResponse(
        patient_id=request.patient_id,
        prediction=str(prediction),
        confidence=round(
            confidence,
            4,
        ),
        model_version=MODEL_VERSION,
        contributing_factors=contributing_factors,
        disclaimer=DISCLAIMER,
    )