package com.hms.patientservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.patientservice.model.EHRRecord;

public interface EHRRecordRepository extends JpaRepository<EHRRecord, Long>{
	List<EHRRecord> findByPatientId(Long patientId);
}
