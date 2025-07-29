package com.hms.patientservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.patientservice.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
