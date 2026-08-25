package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PatientHealthContextDTO {

    private PatientDTO patient;

    private List<AppointmentDTO> appointments =
            new ArrayList<>();

    private List<PrescriptionDTO> prescriptions =
            new ArrayList<>();

    private int totalAppointments;

    private int completedAppointments;

    private int cancelledAppointments;

    private int totalPrescriptions;

    /*
     * Data-quality / availability information.
     */
    private boolean appointmentDataAvailable = true;

    private boolean prescriptionDataAvailable = true;

    private List<String> dataWarnings =
            new ArrayList<>();
}