package com.hms.authservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hms.authservice.client.DoctorClient;
import com.hms.authservice.client.PatientClient;
import com.hms.authservice.dto.AuthRequest;
import com.hms.authservice.dto.AuthResponse;
import com.hms.authservice.dto.RegisterRequest;
import com.hms.authservice.dto.UserResponseDTO;
import com.hms.authservice.exception.DuplicateEmailException;
import com.hms.authservice.exception.InvalidCredentialsException;
import com.hms.authservice.model.Role;
import com.hms.authservice.model.User;
import com.hms.authservice.repository.UserRepository;
import com.hms.authservice.util.JwtUtil;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PatientClient patientClient;

    @Autowired
    private DoctorClient doctorClient;

    @Autowired
    private JwtUtil jwtUtil;

    public UserResponseDTO register(RegisterRequest request) {

        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new DuplicateEmailException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setFullName(request.getName());
        user.setRole(request.getRole());

        User savedUser =
                userRepository.save(user);

        log.info(
                "User registered successfully. userId={}, email={}, role={}",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole()
        );

        return mapToResponseDTO(savedUser);
    }

    public AuthResponse login(
            AuthRequest authRequest) {

        User user =
                userRepository
                        .findByEmail(authRequest.getEmail())
                        .orElseThrow(() ->
                                new InvalidCredentialsException(
                                        "Invalid email or password"
                                )
                        );

        if (!passwordEncoder.matches(
                authRequest.getPassword(),
                user.getPassword())) {

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtUtil.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole(),
                        user.getFullName()
                );

        log.info(
                "User login successful. userId={}, email={}, role={}",
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        return new AuthResponse(
                token,
                user.getRole(),
                user.getFullName()
        );
    }

    public List<UserResponseDTO> getUsersByRole(
            String role) {

        return userRepository
                .findByRole(Role.valueOf(role.toUpperCase()))
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    private UserResponseDTO mapToResponseDTO(
            User user) {

        UserResponseDTO response =
                new UserResponseDTO();

        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());

        return response;
    }
}