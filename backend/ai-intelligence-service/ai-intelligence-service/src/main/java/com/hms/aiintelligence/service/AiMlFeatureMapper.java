package com.hms.aiintelligence.service;

import com.hms.aiintelligence.dto.ClinicalHistoryDTO;
import com.hms.aiintelligence.dto.PatientFeatureVectorDTO;
import com.hms.aiintelligence.dto.PatientFeaturesDTO;
import com.hms.aiintelligence.dto.TemporalFeaturesDTO;

import org.springframework.stereotype.Component;

@Component
public class AiMlFeatureMapper {

    public PatientFeaturesDTO map(
            PatientFeatureVectorDTO features) {

        if (features == null) {
            throw new IllegalArgumentException(
                    "Patient feature vector is required"
            );
        }

        return PatientFeaturesDTO.builder()
                .age(features.getAge())
                .clinical_history(
                        ClinicalHistoryDTO.builder()
                                .condition_count(
                                        features.getUniqueDiagnoses()
                                )
                                .chronic_condition_count(
                                        features.getRecurringDiagnosisCount()
                                )
                                .medication_count(
                                        features.getRepeatedMedicationCount()
                                )
                                .prescription_count(
                                        features.getTotalPrescriptions()
                                )
                                .appointment_count(
                                        features.getTotalAppointments()
                                )
                                .recent_appointment_count(
                                        features.getRecentAppointments()
                                )
                                .build()
                )
                .temporal_features(
                        TemporalFeaturesDTO.builder()
                                .days_since_last_appointment(null)
                                .appointments_last_30_days(
                                        features.getRecentAppointments()
                                )
                                .appointments_last_90_days(
                                        features.getRecentAppointments()
                                )
                                .prescriptions_last_90_days(
                                        features.getRecentPrescriptions()
                                )
                                .build()
                )
                .active_medication_count(
                        features.getRepeatedMedicationCount()
                )
                .specialist_visit_count(0)
                .symptom_count(
                        features.getRecurringSymptomCount()
                )
                .recurring_symptom_count(
                        features.getRecurringSymptomCount()
                )
                .build();
    }
}