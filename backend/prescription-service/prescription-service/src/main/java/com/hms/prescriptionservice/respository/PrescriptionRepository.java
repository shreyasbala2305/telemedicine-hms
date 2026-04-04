package com.hms.prescriptionservice.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.prescriptionservice.model.Prescription;


public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientId(Long patientId);
    List<Prescription> findByDoctorId(Long doctorId);
}