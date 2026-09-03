"""
Generate a reproducible synthetic patient-health dataset for model training.

The dataset follows the patient-health-v1 feature contract used by the
AI/ML inference service.

This synthetic dataset is intended for development and demonstration only.
It must not be treated as real clinical data.
"""

from pathlib import Path

import numpy as np
import pandas as pd


RANDOM_SEED = 42
SAMPLE_COUNT = 5000

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "training" / "data"
OUTPUT_FILE = DATA_DIR / "patient_health_training.csv"

FEATURE_NAMES = [
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
]


def generate_dataset() -> pd.DataFrame:
    rng = np.random.default_rng(RANDOM_SEED)

    age = rng.integers(18, 86, SAMPLE_COUNT)

    condition_count = rng.poisson(1.5, SAMPLE_COUNT)
    condition_count = np.clip(condition_count, 0, 8)

    chronic_condition_count = np.minimum(
        rng.poisson(0.8, SAMPLE_COUNT),
        condition_count,
    )

    medication_count = (
        chronic_condition_count
        + rng.poisson(1.0, SAMPLE_COUNT)
    )
    medication_count = np.clip(medication_count, 0, 10)

    prescription_count = (
        medication_count
        + rng.poisson(2.0, SAMPLE_COUNT)
    )
    prescription_count = np.clip(prescription_count, 0, 20)

    appointment_count = (
        1
        + chronic_condition_count
        + rng.poisson(3.0, SAMPLE_COUNT)
    )
    appointment_count = np.clip(appointment_count, 1, 30)

    recent_appointment_count = rng.poisson(0.8, SAMPLE_COUNT)
    recent_appointment_count = np.clip(
        recent_appointment_count,
        0,
        8,
    )

    days_since_last_appointment = rng.integers(
        0,
        181,
        SAMPLE_COUNT,
    )

    appointments_last_30_days = rng.poisson(
        0.8,
        SAMPLE_COUNT,
    )
    appointments_last_30_days = np.clip(
        appointments_last_30_days,
        0,
        8,
    )

    appointments_last_90_days = (
        appointments_last_30_days
        + rng.poisson(1.8, SAMPLE_COUNT)
    )
    appointments_last_90_days = np.clip(
        appointments_last_90_days,
        0,
        15,
    )

    prescriptions_last_90_days = rng.poisson(
        1.8,
        SAMPLE_COUNT,
    )
    prescriptions_last_90_days = np.clip(
        prescriptions_last_90_days,
        0,
        15,
    )

    active_medication_count = (
        medication_count
        - rng.binomial(
            medication_count,
            0.15,
        )
    )

    specialist_visit_count = rng.poisson(
        1.2,
        SAMPLE_COUNT,
    )
    specialist_visit_count = np.clip(
        specialist_visit_count,
        0,
        12,
    )

    symptom_count = rng.poisson(
        2.0,
        SAMPLE_COUNT,
    )
    symptom_count = np.clip(
        symptom_count,
        0,
        10,
    )

    recurring_symptom_count = rng.binomial(
        symptom_count,
        0.35,
    )

    # ------------------------------------------------------------------
    # Synthetic care-attention signal
    # ------------------------------------------------------------------
    #
    # This is deliberately deterministic enough for the model to learn
    # meaningful relationships while retaining some noise.
    #
    # Higher values indicate that the patient's record may deserve
    # additional clinical review.
    # ------------------------------------------------------------------

    attention_score = (
        0.9 * chronic_condition_count
        + 0.65 * recurring_symptom_count
        + 0.45 * appointments_last_30_days
        + 0.25 * appointments_last_90_days
        + 0.35 * prescriptions_last_90_days
        + 0.30 * active_medication_count
        + 0.40 * specialist_visit_count
        + 0.55 * symptom_count
        + 0.20 * recent_appointment_count
        + 0.15 * condition_count
        + 0.20 * (age >= 65)
        + rng.normal(0, 1.5, SAMPLE_COUNT)
    )

    # Recent activity combined with recurring symptoms is intentionally
    # given additional importance because this represents a potentially
    # useful care-attention pattern in the project.
    attention_score += (
        (recurring_symptom_count >= 2)
        & (appointments_last_30_days >= 2)
    ) * 2.0

    # Three-class target:
    #
    # 0 -> ROUTINE
    # 1 -> REVIEW
    # 2 -> HIGH_ATTENTION
    #
    # These labels are synthetic development labels, not medical diagnoses.
    target = np.select(
        [
            attention_score >= 8.5,
            attention_score >= 4.5,
        ],
        [
            "HIGH_ATTENTION",
            "REVIEW",
        ],
        default="ROUTINE",
    )

    data = pd.DataFrame(
        {
            "age": age,
            "condition_count": condition_count,
            "chronic_condition_count": chronic_condition_count,
            "medication_count": medication_count,
            "prescription_count": prescription_count,
            "appointment_count": appointment_count,
            "recent_appointment_count": recent_appointment_count,
            "days_since_last_appointment": days_since_last_appointment,
            "appointments_last_30_days": appointments_last_30_days,
            "appointments_last_90_days": appointments_last_90_days,
            "prescriptions_last_90_days": prescriptions_last_90_days,
            "active_medication_count": active_medication_count,
            "specialist_visit_count": specialist_visit_count,
            "symptom_count": symptom_count,
            "recurring_symptom_count": recurring_symptom_count,
            "target": target,
        }
    )

    return data


def main() -> None:
    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    dataset = generate_dataset()

    dataset.to_csv(
        OUTPUT_FILE,
        index=False,
    )

    print(f"Generated {len(dataset)} training records.")
    print(f"Dataset: {OUTPUT_FILE}")
    print()
    print("Target distribution:")
    print(dataset["target"].value_counts())
    print()
    print("Feature columns:")
    print(FEATURE_NAMES)


if __name__ == "__main__":
    main()