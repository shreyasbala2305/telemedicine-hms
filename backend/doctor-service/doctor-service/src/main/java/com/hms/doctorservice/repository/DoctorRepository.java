package com.hms.doctorservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.doctorservice.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long>{
	List<Doctor> findBySpeciality(String speciality);

}
