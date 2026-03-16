package com.doctorapp.controller;

import com.doctorapp.dto.ApiResponse;
import com.doctorapp.dto.DoctorAvailabilityDto;
import com.doctorapp.service.DoctorAvailabilityService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
@Slf4j
public class DoctorAvailabilityController {

    @Autowired
    private DoctorAvailabilityService availabilityService;

    @PostMapping
    public ResponseEntity<ApiResponse<DoctorAvailabilityDto>> addAvailability(
            @Valid @RequestBody DoctorAvailabilityDto dto,
            Authentication authentication) {
        log.info("Adding availability for doctor email: {}", authentication.getName());
        DoctorAvailabilityDto availability = availabilityService.addAvailability(authentication.getName(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<DoctorAvailabilityDto>builder()
                        .success(true)
                        .message("Availability added successfully")
                        .data(availability)
                        .build()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityDto>>> getMyAvailability(Authentication authentication) {
        log.info("Fetching availability for current doctor email: {}", authentication.getName());
        List<DoctorAvailabilityDto> availabilities = availabilityService.getAvailabilityByDoctorEmail(authentication.getName());
        return ResponseEntity.ok(
                ApiResponse.<List<DoctorAvailabilityDto>>builder()
                        .success(true)
                        .message("Availabilities fetched successfully")
                        .data(availabilities)
                        .build()
        );
    }

    @PostMapping("/weekly")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityDto>>> saveWeeklyAvailability(
            @RequestBody List<DoctorAvailabilityDto> slots,
            @RequestParam(defaultValue = "true") boolean replaceExisting,
            Authentication authentication) {
        log.info("Saving weekly availability for doctor email: {}, replaceExisting: {}", authentication.getName(), replaceExisting);
        List<DoctorAvailabilityDto> saved = availabilityService.saveWeeklyAvailability(authentication.getName(), slots, replaceExisting);
        return ResponseEntity.ok(
                ApiResponse.<List<DoctorAvailabilityDto>>builder()
                        .success(true)
                        .message("Weekly schedule saved successfully")
                        .data(saved)
                        .build()
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityDto>>> getAvailabilityByDoctorId(@PathVariable Long doctorId) {
        log.info("Fetching availability for doctor: {}", doctorId);
        List<DoctorAvailabilityDto> availabilities = availabilityService.getAvailabilityByDoctorId(doctorId);
        return ResponseEntity.ok(
                ApiResponse.<List<DoctorAvailabilityDto>>builder()
                        .success(true)
                        .message("Availabilities fetched successfully")
                        .data(availabilities)
                        .build()
        );
    }

    @GetMapping("/doctor/{doctorId}/day/{dayOfWeek}")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityDto>>> getAvailabilityByDay(
            @PathVariable Long doctorId,
            @PathVariable String dayOfWeek) {
        log.info("Fetching availability for doctor: {} on day: {}", doctorId, dayOfWeek);
        List<DoctorAvailabilityDto> availabilities = availabilityService.getAvailabilityByDoctorIdAndDay(doctorId, dayOfWeek);
        return ResponseEntity.ok(
                ApiResponse.<List<DoctorAvailabilityDto>>builder()
                        .success(true)
                        .message("Availabilities fetched successfully")
                        .data(availabilities)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteAvailability(@PathVariable Long id) {
        log.info("Deleting availability with id: {}", id);
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Availability deleted successfully")
                        .build()
        );
    }
}
