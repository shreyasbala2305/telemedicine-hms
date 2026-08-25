package com.hms.aiintelligence.dto;

import lombok.Data;

@Data
public class PatientFeatureVectorDTO {

    private String featureVersion = "features-v1";

    private Long patientId;

    private int age;

    private int totalAppointments;

    private int completedAppointments;

    private int cancelledAppointments;

    private int totalPrescriptions;

    private int uniqueDiagnoses;

    private int recurringDiagnosisCount;

    private int recurringSymptomCount;

    private int repeatedMedicationCount;

    private int overdueFollowUpCount;

    private int careGapCount;

    private int recentClinicalEvents;

    private int recentPrescriptions;

    private int recentAppointments;

    private double appointmentCompletionRate;

    private double appointmentCancellationRate;

    private double prescriptionPerAppointmentRatio;

    private double careGapRate;
}