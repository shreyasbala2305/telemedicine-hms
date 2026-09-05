from pathlib import Path
from typing import Any

import joblib
import numpy as np

from app.config import (
    EXPECTED_MODEL_CLASSES,
    FEATURE_VERSION,
    MODEL_PATH,
    MODEL_VERSION,
)
from app.utils.feature_schema import (
    FEATURE_NAMES,
    validate_feature_schema,
    validate_feature_vector,
)


class ModelInferenceError(RuntimeError):
    """Raised when the ML model cannot be loaded or used for inference."""


class CareAttentionModel:
    """
    Wrapper around the Care Attention ML artifact.

    Responsible for:
    - loading the persisted model artifact
    - validating model metadata
    - validating inference inputs
    - performing predictions
    - exposing model metadata
    """

    def __init__(self, model_path: str | Path = MODEL_PATH):
        self.model_path = Path(model_path)

        self.model: Any = None

        self.model_version: str | None = None
        self.feature_version: str | None = None

        self.feature_names: list[str] = []
        self.classes: list[str] = []

    def load(self) -> None:
        """
        Load and validate the persisted model artifact.
        """

        if not self.model_path.exists():
            raise ModelInferenceError(
                f"ML model artifact not found: {self.model_path}"
            )

        try:
            artifact = joblib.load(self.model_path)
        except Exception as exc:
            raise ModelInferenceError(
                "Unable to load the ML model artifact."
            ) from exc

        if not isinstance(artifact, dict):
            raise ModelInferenceError(
                "Invalid ML model artifact format."
            )

        required_keys = {
            "model",
            "model_version",
            "feature_version",
            "feature_names",
            "classes",
        }

        missing_keys = required_keys - artifact.keys()

        if missing_keys:
            raise ModelInferenceError(
                "ML model artifact is missing required metadata: "
                + ", ".join(sorted(missing_keys))
            )

        self.model = artifact["model"]
        self.model_version = artifact["model_version"]
        self.feature_version = artifact["feature_version"]

        try:
            self.feature_names = list(
                artifact["feature_names"]
            )
        except (TypeError, ValueError) as exc:
            raise ModelInferenceError(
                "ML model artifact contains invalid feature names."
            ) from exc

        try:
            self.classes = [
                str(value)
                for value in artifact["classes"]
            ]
        except (TypeError, ValueError) as exc:
            raise ModelInferenceError(
                "ML model artifact contains invalid class metadata."
            ) from exc

        self._validate_model()

    def _validate_model(self) -> None:
        """
        Validate the loaded model against the application contract.
        """

        if self.model is None:
            raise ModelInferenceError(
                "ML model artifact does not contain a model."
            )

        if not hasattr(self.model, "predict"):
            raise ModelInferenceError(
                "Loaded ML model does not support prediction."
            )

        if not hasattr(self.model, "predict_proba"):
            raise ModelInferenceError(
                "Loaded ML model does not support probability prediction."
            )

        if self.model_version != MODEL_VERSION:
            raise ModelInferenceError(
                "ML model version mismatch. "
                f"Expected '{MODEL_VERSION}', "
                f"received '{self.model_version}'."
            )

        if self.feature_version != FEATURE_VERSION:
            raise ModelInferenceError(
                "ML feature version mismatch. "
                f"Expected '{FEATURE_VERSION}', "
                f"received '{self.feature_version}'."
            )

        try:
            validate_feature_schema(
                self.feature_names
            )
        except ValueError as exc:
            raise ModelInferenceError(
                "ML feature schema validation failed."
            ) from exc

        model_classes = getattr(
            self.model,
            "classes_",
            None,
        )

        if model_classes is None:
            raise ModelInferenceError(
                "ML model does not expose class labels."
            )

        model_classes = [
            str(value)
            for value in model_classes
        ]

        if model_classes != self.classes:
            raise ModelInferenceError(
                "ML model classes do not match artifact metadata."
            )

        if tuple(self.classes) != EXPECTED_MODEL_CLASSES:
            raise ModelInferenceError(
                "ML model classes do not match the expected "
                "Care Attention prediction classes."
            )

    def predict(
        self,
        feature_vector: list[float],
    ) -> tuple[str, dict[str, float]]:
        """
        Run inference for one patient feature vector.
        """

        if self.model is None:
            raise ModelInferenceError(
                "ML model has not been loaded."
            )

        try:
            validate_feature_vector(
                feature_vector
            )
        except ValueError as exc:
            raise ModelInferenceError(
                "Invalid ML feature vector."
            ) from exc

        model_input = np.array(
            [feature_vector],
            dtype=float,
        )

        try:
            prediction = self.model.predict(
                model_input
            )[0]

            probabilities = self.model.predict_proba(
                model_input
            )[0]

        except Exception as exc:
            raise ModelInferenceError(
                "ML model inference failed."
            ) from exc

        if len(self.classes) != len(probabilities):
            raise ModelInferenceError(
                "ML model classes are inconsistent with "
                "prediction probabilities."
            )

        class_probabilities = {
            str(label): float(probability)
            for label, probability in zip(
                self.classes,
                probabilities,
            )
        }

        return (
            str(prediction),
            class_probabilities,
        )

    def get_feature_importances(self) -> list[float]:
        """
        Return global feature importances from the trained model.

        These values describe feature importance in the trained
        Random Forest. They are NOT patient-specific contributions.
        """

        if self.model is None:
            raise ModelInferenceError(
                "ML model has not been loaded."
            )

        importances = getattr(
            self.model,
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


_model = CareAttentionModel()


def load_model() -> None:
    """Load and validate the model during application startup."""
    _model.load()


def get_model() -> CareAttentionModel:
    """Return the loaded Care Attention model."""
    return _model