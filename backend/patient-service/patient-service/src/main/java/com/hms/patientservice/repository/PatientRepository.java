package com.hms.patientservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.patientservice.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long>{
	Optional<Patient> findByUserId(Long userId);
}
