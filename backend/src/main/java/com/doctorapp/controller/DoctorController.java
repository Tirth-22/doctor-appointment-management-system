package com.doctorapp.controller;

import com.doctorapp.dto.ApiResponse;
import com.doctorapp.dto.DoctorDto;
import com.doctorapp.service.DoctorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getAllDoctors() {
        log.info("Fetching all doctors");
        List<DoctorDto> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(
                ApiResponse.<List<DoctorDto>>builder()
                        .success(true)
                        .message("Doctors fetched successfully")
                        .data(doctors)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorById(@PathVariable Long id) {
        log.info("Fetching doctor with id: {}", id);
        DoctorDto doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(
                ApiResponse.<DoctorDto>builder()
                        .success(true)
                        .message("Doctor fetched successfully")
                        .data(doctor)
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> searchDoctors(@RequestParam(required = false) String query) {
        log.info("Full-text doctor search with query: {}", query);
        List<DoctorDto> doctors = doctorService.searchDoctors(query);
        return ResponseEntity.ok(
                ApiResponse.<List<DoctorDto>>builder()
                        .success(true)
                        .message("Search completed successfully")
                        .data(doctors)
                        .build()
        );
    }

    @GetMapping("/search/name")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> searchByName(@RequestParam String name) {
        log.info("Searching doctors by name: {}", name);
        List<DoctorDto> doctors = doctorService.searchDoctorsByName(name);
        return ResponseEntity.ok(
                ApiResponse.<List<DoctorDto>>builder()
                        .success(true)
                        .message("Search completed successfully")
                        .data(doctors)
                        .build()
        );
    }

    @GetMapping("/search/specialization")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> searchBySpecialization(@RequestParam String specialization) {
        log.info("Searching doctors by specialization: {}", specialization);
        List<DoctorDto> doctors = doctorService.searchDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(
                ApiResponse.<List<DoctorDto>>builder()
                        .success(true)
                        .message("Search completed successfully")
                        .data(doctors)
                        .build()
        );
    }

    @GetMapping("/search/hospital")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> searchByHospital(@RequestParam String hospital) {
        log.info("Searching doctors by hospital: {}", hospital);
        List<DoctorDto> doctors = doctorService.searchDoctorsByHospital(hospital);
        return ResponseEntity.ok(
                ApiResponse.<List<DoctorDto>>builder()
                        .success(true)
                        .message("Search completed successfully")
                        .data(doctors)
                        .build()
        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<DoctorDto>> updateProfile(@PathVariable Long userId, @RequestBody DoctorDto dto) {
        log.info("Updating doctor profile with userId: {}", userId);
        DoctorDto updatedDoctor = doctorService.updateDoctorProfile(userId, dto);
        return ResponseEntity.ok(
                ApiResponse.<DoctorDto>builder()
                        .success(true)
                        .message("Doctor profile updated successfully")
                        .data(updatedDoctor)
                        .build()
        );
    }
}
