package com.doctorapp.controller;

import com.doctorapp.dto.ApiResponse;
import com.doctorapp.dto.AppointmentDto;
import com.doctorapp.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@Slf4j
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentDto>> bookAppointment(
            @Valid @RequestBody AppointmentDto dto,
            Authentication authentication) {
        String userEmail = authentication.getName();
        log.info("Booking appointment for patient email: {}", userEmail);

        AppointmentDto appointment = appointmentService.bookAppointmentForUser(userEmail, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AppointmentDto>builder()
                        .success(true)
                        .message("Appointment booked successfully")
                        .data(appointment)
                        .build()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getMyAppointments(Authentication authentication) {
        String userEmail = authentication.getName();
        log.info("Fetching appointments for email: {}", userEmail);

        List<AppointmentDto> appointments = appointmentService.getAppointmentsByUserEmail(userEmail);
        return ResponseEntity.ok(
                ApiResponse.<List<AppointmentDto>>builder()
                        .success(true)
                        .message("Appointments fetched successfully")
                        .data(appointments)
                        .build()
        );
    }

    @GetMapping("/doctor/my")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getDoctorAppointments(Authentication authentication) {
        String userEmail = authentication.getName();
        log.info("Fetching doctor appointments for email: {}", userEmail);

        List<AppointmentDto> appointments = appointmentService.getDoctorAppointmentsByEmail(userEmail);
        return ResponseEntity.ok(
                ApiResponse.<List<AppointmentDto>>builder()
                        .success(true)
                        .message("Doctor appointments fetched successfully")
                        .data(appointments)
                        .build()
        );
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<AppointmentDto>> acceptAppointment(
            @PathVariable Long id,
            Authentication authentication) {
        String doctorEmail = authentication.getName();
        log.info("Doctor {} accepting appointment {}", doctorEmail, id);

        AppointmentDto appointment = appointmentService.acceptAppointment(id, doctorEmail);
        return ResponseEntity.ok(
                ApiResponse.<AppointmentDto>builder()
                        .success(true)
                        .message("Appointment accepted")
                        .data(appointment)
                        .build()
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<AppointmentDto>> rejectAppointment(
            @PathVariable Long id,
            Authentication authentication) {
        String doctorEmail = authentication.getName();
        log.info("Doctor {} rejecting appointment {}", doctorEmail, id);

        AppointmentDto appointment = appointmentService.rejectAppointment(id, doctorEmail);
        return ResponseEntity.ok(
                ApiResponse.<AppointmentDto>builder()
                        .success(true)
                        .message("Appointment rejected")
                        .data(appointment)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentDto>> getAppointmentById(@PathVariable Long id) {
        log.info("Fetching appointment with id: {}", id);
        AppointmentDto appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(
                ApiResponse.<AppointmentDto>builder()
                        .success(true)
                        .message("Appointment fetched successfully")
                        .data(appointment)
                        .build()
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        log.info("Updating appointment {} status to: {}", id, status);
        AppointmentDto appointment = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(
                ApiResponse.<AppointmentDto>builder()
                        .success(true)
                        .message("Appointment status updated successfully")
                        .data(appointment)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> cancelAppointment(@PathVariable Long id) {
        log.info("Cancelling appointment with id: {}", id);
        appointmentService.cancelAppointment(id);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Appointment cancelled successfully")
                        .build()
        );
    }
}
