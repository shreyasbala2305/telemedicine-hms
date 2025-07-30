package com.hms.doctorservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.doctorservice.dto.DoctorDTO;
import com.hms.doctorservice.model.Doctor;
import com.hms.doctorservice.repository.DoctorRepository;

@Service
public class DoctorService {
	
	@Autowired
	private DoctorRepository doctorRepository;
	
	public Doctor createDoctor(DoctorDTO dto) {
		Doctor doctor = new Doctor();
		doctor.setName(dto.name);
		doctor.setEmail(dto.email);
		doctor.setContact(dto.contact);
		doctor.setSpeciality(dto.speciality);
		doctor.setQualification(dto.qualification);
		doctor.setAvailability(dto.availability);
		
		return doctorRepository.save(doctor);
	}
	
	public List<Doctor> getAll(){
		return doctorRepository.findAll();
	}
	
	public List<Doctor> getDoctorsBySpeciality(String speciality){
		return doctorRepository.findBySpeciality(speciality);
	}
	
	public Doctor updateAvailability(Long id, List<String> newAvailability) {
		Doctor doctor = doctorRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Doctor not found"));
		
		doctor.setAvailability(newAvailability);
		return doctorRepository.save(doctor);
	}
}
