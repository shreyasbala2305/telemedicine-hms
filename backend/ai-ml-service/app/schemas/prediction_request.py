from typing import List, Optional

from pydantic import BaseModel, Field


class ClinicalHistory(BaseModel):
    condition_count: int = Field(default=0, ge=0)
    chronic_condition_count: int = Field(default=0, ge=0)
    medication_count: int = Field(default=0, ge=0)
    prescription_count: int = Field(default=0, ge=0)
    appointment_count: int = Field(default=0, ge=0)
    recent_appointment_count: int = Field(default=0, ge=0)


class TemporalFeatures(BaseModel):
    days_since_last_appointment: Optional[int] = Field(
        default=None,
        ge=0
    )

    appointments_last_30_days: int = Field(
        default=0,
        ge=0
    )

    appointments_last_90_days: int = Field(
        default=0,
        ge=0
    )

    prescriptions_last_90_days: int = Field(
        default=0,
        ge=0
    )


class PatientFeatures(BaseModel):
    age: Optional[int] = Field(
        default=None,
        ge=0,
        le=120
    )

    gender: Optional[str] = None

    clinical_history: ClinicalHistory = Field(
        default_factory=ClinicalHistory
    )

    temporal_features: TemporalFeatures = Field(
        default_factory=TemporalFeatures
    )

    active_medication_count: int = Field(
        default=0,
        ge=0
    )

    specialist_visit_count: int = Field(
        default=0,
        ge=0
    )

    symptom_count: int = Field(
        default=0,
        ge=0
    )

    recurring_symptom_count: int = Field(
        default=0,
        ge=0
    )

    features: List[float] = Field(
        default_factory=list
    )


class PredictionRequest(BaseModel):
    patient_id: int = Field(
        ...,
        gt=0
    )

    features: PatientFeatures