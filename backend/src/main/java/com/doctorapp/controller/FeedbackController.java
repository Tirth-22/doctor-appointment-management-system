package com.doctorapp.controller;

import com.doctorapp.dto.ApiResponse;
import com.doctorapp.dto.FeedbackDto;
import com.doctorapp.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@Slf4j
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse<FeedbackDto>> submitFeedback(
            @PathVariable Long appointmentId,
            @Valid @RequestBody FeedbackDto dto,
            Authentication authentication) {
        String patientEmail = authentication.getName();
        log.info("Submitting feedback for appointment {} by patient {}", appointmentId, patientEmail);

        FeedbackDto feedback = feedbackService.submitFeedback(appointmentId, dto, patientEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<FeedbackDto>builder()
                        .success(true)
                        .message("Feedback saved successfully")
                        .data(feedback)
                        .build()
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getDoctorFeedback(
            @PathVariable Long doctorId) {
        log.info("Fetching feedback for doctor {}", doctorId);

        List<FeedbackDto> feedbacks = feedbackService.getDoctorFeedback(doctorId);
        return ResponseEntity.ok(
                ApiResponse.<List<FeedbackDto>>builder()
                        .success(true)
                        .message("Doctor feedback fetched successfully")
                        .data(feedbacks)
                        .build()
        );
    }

    @GetMapping("/doctor/{doctorId}/rating")
    public ResponseEntity<ApiResponse<Double>> getDoctorAverageRating(
            @PathVariable Long doctorId) {
        log.info("Fetching average rating for doctor {}", doctorId);

        Double rating = feedbackService.getDoctorAverageRating(doctorId);
        return ResponseEntity.ok(
                ApiResponse.<Double>builder()
                        .success(true)
                        .message("Doctor rating fetched successfully")
                        .data(rating)
                        .build()
        );
    }

    @GetMapping("/doctor/{doctorId}/count")
    public ResponseEntity<ApiResponse<Integer>> getDoctorFeedbackCount(
            @PathVariable Long doctorId) {
        log.info("Fetching feedback count for doctor {}", doctorId);

        Integer count = feedbackService.getDoctorFeedbackCount(doctorId);
        return ResponseEntity.ok(
                ApiResponse.<Integer>builder()
                        .success(true)
                        .message("Doctor feedback count fetched successfully")
                        .data(count)
                        .build()
        );
    }

    @GetMapping("/patient/my")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getMyFeedback(
            Authentication authentication) {
        String patientEmail = authentication.getName();
        log.info("Fetching feedback for patient {}", patientEmail);

        // This would need to be enhanced to get patient ID from email
        // For now, returning empty list
        return ResponseEntity.ok(
                ApiResponse.<List<FeedbackDto>>builder()
                        .success(true)
                        .message("Patient feedback fetched successfully")
                        .data(List.of())
                        .build()
        );
    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse<FeedbackDto>> getFeedback(
            @PathVariable Long feedbackId) {
        log.info("Fetching feedback {}", feedbackId);

        FeedbackDto feedback = feedbackService.getFeedbackById(feedbackId);
        return ResponseEntity.ok(
                ApiResponse.<FeedbackDto>builder()
                        .success(true)
                        .message("Feedback fetched successfully")
                        .data(feedback)
                        .build()
        );
    }
}
