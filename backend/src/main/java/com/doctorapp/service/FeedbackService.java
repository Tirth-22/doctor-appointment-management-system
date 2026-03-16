package com.doctorapp.service;

import com.doctorapp.dto.FeedbackDto;
import com.doctorapp.entity.*;
import com.doctorapp.exception.BadRequestException;
import com.doctorapp.exception.ResourceNotFoundException;
import com.doctorapp.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@Transactional
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    public FeedbackDto submitFeedback(Long appointmentId, FeedbackDto feedbackDto, String patientEmail) {
        // Validate appointment exists
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        // Validate appointment is completed
        if (!appointment.getStatus().equals(AppointmentStatus.COMPLETED)) {
            throw new BadRequestException("Feedback can only be submitted for completed appointments");
        }

        // Get patient from email
        User patientUser = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Patient patient = patientRepository.findByUserId(patientUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        // Verify patient owns this appointment
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new BadRequestException("Only the patient who booked this appointment can submit feedback");
        }

        // Check if feedback already exists
        if (feedbackRepository.findByAppointmentIdAndPatientId(appointmentId, patient.getId()).isPresent()) {
            throw new BadRequestException("Feedback already submitted for this appointment");
        }

        // Create feedback
        Feedback feedback = Feedback.builder()
                .appointment(appointment)
                .doctor(appointment.getDoctor())
                .patient(patient)
                .rating(feedbackDto.getRating())
                .comment(feedbackDto.getComment())
                .wouldRecommend(feedbackDto.getWouldRecommend() != null ? feedbackDto.getWouldRecommend() : true)
                .build();

        feedback = feedbackRepository.save(feedback);
        log.info("Feedback submitted for appointment {}", appointmentId);

        return convertToDto(feedback);
    }

    public List<FeedbackDto> getDoctorFeedback(Long doctorId) {
        return feedbackRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<FeedbackDto> getPatientFeedback(Long patientId) {
        return feedbackRepository.findByPatientId(patientId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public FeedbackDto getFeedbackById(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
        return convertToDto(feedback);
    }

    public List<FeedbackDto> getAppointmentFeedback(Long appointmentId) {
        return feedbackRepository.findByAppointmentId(appointmentId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public Double getDoctorAverageRating(Long doctorId) {
        List<Feedback> feedbacks = feedbackRepository.findByDoctorId(doctorId);
        if (feedbacks.isEmpty()) {
            return 0.0;
        }
        return feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);
    }

    public Integer getDoctorFeedbackCount(Long doctorId) {
        return (int) feedbackRepository.findByDoctorId(doctorId).size();
    }

    private FeedbackDto convertToDto(Feedback feedback) {
        return FeedbackDto.builder()
                .id(feedback.getId())
                .appointmentId(feedback.getAppointment().getId())
                .doctorId(feedback.getDoctor().getId())
                .doctorName(feedback.getDoctor().getUser().getName())
                .patientId(feedback.getPatient().getId())
                .patientName(feedback.getPatient().getUser().getName())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .wouldRecommend(feedback.getWouldRecommend())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
