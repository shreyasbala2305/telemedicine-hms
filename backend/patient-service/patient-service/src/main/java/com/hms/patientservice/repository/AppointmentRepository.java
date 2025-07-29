package com.hms.patientservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.patientservice.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long>{

}
