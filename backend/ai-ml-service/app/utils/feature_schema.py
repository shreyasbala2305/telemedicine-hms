from typing import Final, Tuple


FEATURE_NAMES: Final[Tuple[str, ...]] = (
    "age",
    "condition_count",
    "chronic_condition_count",
    "medication_count",
    "prescription_count",
    "appointment_count",
    "recent_appointment_count",
    "days_since_last_appointment",
    "appointments_last_30_days",
    "appointments_last_90_days",
    "prescriptions_last_90_days",
    "active_medication_count",
    "specialist_visit_count",
    "symptom_count",
    "recurring_symptom_count",
)

FEATURE_VERSION: Final[str] = "patient-health-v1"

def validate_feature_schema(
    feature_names: list[str],
) -> None:

    expected = list(FEATURE_NAMES)

    if feature_names != expected:
        raise ValueError(
            "Feature schema mismatch. "
            f"Expected {expected}, "
            f"received {feature_names}"
        )

def validate_feature_vector(features: list[float]) -> None:
    """
    Validate that the incoming feature vector matches the
    versioned feature contract used by the ML model.
    """
    expected = len(FEATURE_NAMES)

    if len(features) != expected:
        raise ValueError(
            f"Invalid feature vector length: expected {expected}, "
            f"received {len(features)}"
        )


def feature_vector_from_named_features(features) -> list[float]:
    """
    Convert the structured PatientFeatures DTO into the exact,
    deterministic feature ordering expected by the ML model.
    """
    days_since_last_appointment = (
        features.temporal_features.days_since_last_appointment
    )

    return [
        float(features.age if features.age is not None else 0),
        float(features.clinical_history.condition_count),
        float(features.clinical_history.chronic_condition_count),
        float(features.clinical_history.medication_count),
        float(features.clinical_history.prescription_count),
        float(features.clinical_history.appointment_count),
        float(features.clinical_history.recent_appointment_count),
        float(
            days_since_last_appointment
            if days_since_last_appointment is not None
            else 999
        ),
        float(features.temporal_features.appointments_last_30_days),
        float(features.temporal_features.appointments_last_90_days),
        float(features.temporal_features.prescriptions_last_90_days),
        float(features.active_medication_count),
        float(features.specialist_visit_count),
        float(features.symptom_count),
        float(features.recurring_symptom_count),
    ]