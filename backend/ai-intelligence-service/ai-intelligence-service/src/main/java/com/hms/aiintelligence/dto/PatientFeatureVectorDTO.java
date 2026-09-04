package com.hms.aiintelligence.dto;

import lombok.Data;

@Data
public class PatientFeatureVectorDTO {

    private String featureVersion = "features-v1";

    private Long patientId;

    private int age;

    // Appointment history
    private int totalAppointments;
    private int completedAppointments;
    private int cancelledAppointments;

    // Prescription history
    private int totalPrescriptions;

    // Diagnosis features
    private int uniqueDiagnoses;
    private int chronicConditionCount;
    private int recurringDiagnosisCount;

    // Symptom features
    private int symptomCount;
    private int recurringSymptomCount;

    // Medication features
    private int medicationCount;
    private int activeMedicationCount;
    private int repeatedMedicationCount;

    // Specialist care
    private int specialistVisitCount;

    // Care-gap features
    private int overdueFollowUpCount;
    private int careGapCount;

    // Existing recent activity features
    private int recentClinicalEvents;
    private int recentPrescriptions;
    private int recentAppointments;

    // Exact temporal features used by patient-health-v1
    private int appointmentsLast30Days;
    private int appointmentsLast90Days;
    private int prescriptionsLast90Days;

    private Integer daysSinceLastAppointment;

    // Derived metrics
    private double appointmentCompletionRate;
    private double appointmentCancellationRate;
    private double prescriptionPerAppointmentRatio;
    private double careGapRate;
}