package com.hms.doctorservice.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "doctors")
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "Name is mandatory")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
	private String name;
	
	@NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email format")
	@Column(nullable = false, unique = true)
	private String email;
	
	@NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian contact number")
	private String contact;
	
	@NotBlank(message = "Speciality is required")
    @Size(min = 3, max = 50, message = "Speciality must be between 3 and 50 characters")
	private String speciality;
	
	@NotBlank(message = "Qualification is required")
    @Size(min = 5, max = 100, message = "Qualification must be descriptive (5-100 characters)")
	private String qualification;
	
	@ElementCollection
	@NotEmpty(message = "Availability must contain at least one entry")
	private List<@Pattern(
	        regexp = "^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\\s\\d{2}:\\d{2}-\\d{2}:\\d{2}$",
	        message = "Availability must be in format 'Day HH:MM-HH:MM'")
	String> availability;
}
