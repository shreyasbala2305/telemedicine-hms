package com.hms.aiintelligence.service;

import org.springframework.stereotype.Component;

import com.hms.aiintelligence.dto.AiMlPredictionRequestDTO;
import com.hms.aiintelligence.dto.ClinicalHistoryDTO;
import com.hms.aiintelligence.dto.PatientFeatureVectorDTO;
import com.hms.aiintelligence.dto.PatientFeaturesDTO;
import com.hms.aiintelligence.dto.TemporalFeaturesDTO;

@Component
public class AiMlFeatureMapper {

    public AiMlPredictionRequestDTO toPredictionRequest(
            Long patientId,
            PatientFeatureVectorDTO features) {

        ClinicalHistoryDTO clinicalHistory =
                new ClinicalHistoryDTO();

        /*
         * condition_count:
         * Number of unique diagnoses.
         */
        clinicalHistory.setCondition_count(
                features.getUniqueDiagnoses()
        );

        /*
         * chronic_condition_count:
         * Currently exposed by the Java feature vector.
         *
         * The FeatureEngineeringService is responsible for
         * determining its value.
         */
        clinicalHistory.setChronic_condition_count(
                features.getChronicConditionCount()
        );

        /*
         * medication_count:
         * Number of unique medications.
         *
         * Do NOT use repeatedMedicationCount here.
         */
        clinicalHistory.setMedication_count(
                features.getMedicationCount()
        );

        /*
         * prescription_count:
         * Total prescriptions in the patient's history.
         */
        clinicalHistory.setPrescription_count(
                features.getTotalPrescriptions()
        );

        /*
         * appointment_count:
         * Total appointments in the patient's history.
         */
        clinicalHistory.setAppointment_count(
                features.getTotalAppointments()
        );

        /*
         * recent_appointment_count:
         * Existing 90-day recent appointment feature.
         */
        clinicalHistory.setRecent_appointment_count(
                features.getRecentAppointments()
        );

        TemporalFeaturesDTO temporalFeatures =
                new TemporalFeaturesDTO();

        /*
         * Exact temporal feature calculated from the
         * patient's appointment timeline.
         */
        temporalFeatures.setDays_since_last_appointment(
                features.getDaysSinceLastAppointment()
        );

        /*
         * Exact 30-day appointment count.
         */
        temporalFeatures.setAppointments_last_30_days(
                features.getAppointmentsLast30Days()
        );

        /*
         * Exact 90-day appointment count.
         */
        temporalFeatures.setAppointments_last_90_days(
                features.getAppointmentsLast90Days()
        );

        /*
         * Exact 90-day prescription count.
         */
        temporalFeatures.setPrescriptions_last_90_days(
                features.getPrescriptionsLast90Days()
        );

        PatientFeaturesDTO patientFeatures =
                new PatientFeaturesDTO();

        /*
         * Demographics.
         *
         * Gender is not currently part of the Java feature
         * engineering output, so it remains null.
         */
        patientFeatures.setAge(
                features.getAge()
        );

        patientFeatures.setGender(null);

        /*
         * Nested clinical history.
         */
        patientFeatures.setClinical_history(
                clinicalHistory
        );

        /*
         * Nested temporal features.
         */
        patientFeatures.setTemporal_features(
                temporalFeatures
        );

        /*
         * Active medication count.
         */
        patientFeatures.setActive_medication_count(
                features.getActiveMedicationCount()
        );

        /*
         * Specialist visit count.
         */
        patientFeatures.setSpecialist_visit_count(
                features.getSpecialistVisitCount()
        );

        /*
         * Total unique symptom count.
         */
        patientFeatures.setSymptom_count(
                features.getSymptomCount()
        );

        /*
         * Recurring symptom count.
         */
        patientFeatures.setRecurring_symptom_count(
                features.getRecurringSymptomCount()
        );

        return AiMlPredictionRequestDTO.builder()
                .patient_id(patientId)
                .features(patientFeatures)
                .build();
    }
}