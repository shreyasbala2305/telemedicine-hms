package com.hms.appointmentservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.appointmentservice.model.Appointment;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    Page<Appointment> findByPatientId(
            Long patientId,
            Pageable pageable
    );

    Page<Appointment> findByDoctorId(
            Long doctorId,
            Pageable pageable
    );

    Page<Appointment> findByStatus(
            Appointment.Status status,
            Pageable pageable
    );

    Page<Appointment> findByDoctorIdAndStatus(
            Long doctorId,
            Appointment.Status status,
            Pageable pageable
    );

    Page<Appointment> findByPatientIdAndStatus(
            Long patientId,
            Appointment.Status status,
            Pageable pageable
    );

    boolean existsByDoctorIdAndDateTime(
            Long doctorId,
            LocalDateTime dateTime
    );

    List<Appointment> findByDoctorIdAndDateTimeBetween(
            Long doctorId,
            LocalDateTime start,
            LocalDateTime end
    );
}