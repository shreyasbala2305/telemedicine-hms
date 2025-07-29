package com.hms.patientservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.patientservice.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long>{

}
