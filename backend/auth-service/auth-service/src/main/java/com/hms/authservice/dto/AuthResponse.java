package com.hms.authservice.dto;

import com.hms.authservice.model.Role;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthResponse {
	public String token;
	public Role role;
	public String fullName;	
}
