package com.doctorapp.service;

import com.doctorapp.dto.UserDto;
import com.doctorapp.entity.Doctor;
import com.doctorapp.entity.Patient;
import com.doctorapp.entity.Role;
import com.doctorapp.entity.User;
import com.doctorapp.exception.ResourceNotFoundException;
import com.doctorapp.repository.AppointmentRepository;
import com.doctorapp.repository.DoctorAvailabilityRepository;
import com.doctorapp.repository.DoctorRepository;
import com.doctorapp.repository.FeedbackRepository;
import com.doctorapp.repository.PatientRepository;
import com.doctorapp.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@Transactional
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private DoctorAvailabilityRepository doctorAvailabilityRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::convertToDto).toList();
    }

    public List<UserDto> getUsersByRole(String role) {
        try {
            Role roleEnum = Role.valueOf(role.toUpperCase());
            return userRepository.findByRole(roleEnum).stream().map(this::convertToDto).toList();
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role");
        }
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorRepository.findByUserId(userId)
                    .orElse(null);
            if (doctor != null) {
                feedbackRepository.deleteByDoctorId(doctor.getId());
                appointmentRepository.deleteByDoctorId(doctor.getId());
                doctorAvailabilityRepository.deleteByDoctorId(doctor.getId());
                doctorRepository.delete(doctor);
            }
        } else if (user.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUserId(userId)
                    .orElse(null);
            if (patient != null) {
                feedbackRepository.deleteByPatientId(patient.getId());
                appointmentRepository.deleteByPatientId(patient.getId());
                patientRepository.delete(patient);
            }
        }

        userRepository.deleteById(userId);
    }

    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
