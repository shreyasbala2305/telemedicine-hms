package com.hms.doctorservice.dto;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class DoctorDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    @Size(
        min = 3,
        max = 50,
        message = "Name must be between 3 and 50 characters"
    )
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Contact number is required")
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Invalid Indian contact number"
    )
    private String contact;

    @NotBlank(message = "Speciality is required")
    @Size(
        min = 3,
        max = 50,
        message = "Speciality must be between 3 and 50 characters"
    )
    private String speciality;

    @NotBlank(message = "Qualification is required")
    @Size(
        min = 1,
        max = 100,
        message = "Qualification must be between 1 and 100 characters"
    )
    private String qualification;

    private Long userId;

    private List<@Pattern(
        regexp = "^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\\s\\d{2}:\\d{2}-\\d{2}:\\d{2}$",
        message = "Availability must be in format 'Day HH:MM-HH:MM'"
    ) String> availability;
}