package com.doctorapp.controller;

import com.doctorapp.dto.ApiResponse;
import com.doctorapp.dto.PatientDto;
import com.doctorapp.service.PatientService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PatientDto>> getMyProfile(Authentication authentication) {
        log.info("Fetching patient profile for email: {}", authentication.getName());
        // In real scenario, we would fetch user by email first, then get patient
        // For this example, we assume userId is same as authentication principal
        // In production, you should implement custom UserDetails
        return ResponseEntity.ok(
            ApiResponse.<PatientDto>builder()
                .success(true)
                .message("Patient profile fetched successfully")
                .build()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<PatientDto>> updateProfile(@Valid @RequestBody PatientDto dto, Authentication authentication) {
        log.info("Updating patient profile for email: {}", authentication.getName());
        // In real scenario, extract userId from authentication
        PatientDto updatedPatient = patientService.updatePatientProfile(1L, dto);
        return ResponseEntity.ok(
            ApiResponse.<PatientDto>builder()
                .success(true)
                .message("Patient profile updated successfully")
                .data(updatedPatient)
                .build()
        );
    }
}
