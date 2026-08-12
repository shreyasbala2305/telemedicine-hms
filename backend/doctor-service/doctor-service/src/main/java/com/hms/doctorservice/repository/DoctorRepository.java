package com.hms.doctorservice.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.doctorservice.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Page<Doctor> findBySpecialityIgnoreCase(
            String speciality,
            Pageable pageable
    );

    Optional<Doctor> findByUserId(Long userId);
}