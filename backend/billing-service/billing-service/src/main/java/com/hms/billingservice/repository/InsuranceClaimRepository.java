package com.hms.billingservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.billingservice.model.InsuranceClaim;

public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long>{
    List<InsuranceClaim> findByPatientId(Long patientId);
}
