package com.doctorapp.service;

import com.doctorapp.dto.AppointmentDto;
import com.doctorapp.entity.*;
import com.doctorapp.exception.BadRequestException;
import com.doctorapp.exception.ResourceNotFoundException;
import com.doctorapp.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Slf4j
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorAvailabilityRepository doctorAvailabilityRepository;

    @Autowired
    private UserRepository userRepository;

    public AppointmentDto bookAppointment(Long patientUserId, AppointmentDto dto) {
        User user = userRepository.findById(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user has a patient profile, if not create one
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseGet(() -> {
                    // Create a patient profile if user doesn't have one
                    Patient newPatient = Patient.builder()
                            .user(user)
                            .build();
                    return patientRepository.save(newPatient);
                });

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (!isDoctorAvailable(doctor.getId(), dto.getAppointmentDate(), dto.getAppointmentTime())) {
            throw new BadRequestException("Doctor not available at this date/time");
        }

        LocalDateTime appointmentDateTime = dto.getAppointmentDate().atStartOfDay();

        boolean isSlotTaken = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                doctor.getId(),
                appointmentDateTime,
                dto.getAppointmentTime(),
                AppointmentStatus.CANCELLED
        );
        if (isSlotTaken) {
            throw new BadRequestException("Doctor already has an appointment at this date/time");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(appointmentDateTime)
                .appointmentTime(dto.getAppointmentTime())
                .status(AppointmentStatus.PENDING)
                .notes(dto.getNotes())
                .build();

        appointment = appointmentRepository.save(appointment);
        return convertToDto(appointment);
    }

    private boolean isDoctorAvailable(Long doctorId, LocalDate appointmentDate, String appointmentTime) {
        String dayOfWeek = appointmentDate.getDayOfWeek().name();
        List<DoctorAvailability> availabilities = doctorAvailabilityRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);

        if (availabilities.isEmpty()) {
            return false;
        }

        LocalTime requestedTime;
        try {
            requestedTime = LocalTime.parse(appointmentTime);
        } catch (Exception ex) {
            throw new BadRequestException("Invalid appointment time format");
        }

        return availabilities.stream().anyMatch(slot -> {
            LocalTime start = LocalTime.parse(slot.getStartTime());
            LocalTime end = LocalTime.parse(slot.getEndTime());
            // Start is inclusive, end is exclusive to avoid overlap between adjacent slots.
            return !requestedTime.isBefore(start) && requestedTime.isBefore(end);
        });
    }

    public AppointmentDto bookAppointmentForUser(String userEmail, AppointmentDto dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return bookAppointment(user.getId(), dto);
    }

    public AppointmentDto updateAppointmentStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        try {
            appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid appointment status");
        }

        appointment = appointmentRepository.save(appointment);
        return convertToDto(appointment);
    }

    public AppointmentDto getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        return convertToDto(appointment);
    }

    public List<AppointmentDto> getPatientAppointments(Long patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        return appointmentRepository.findByPatientId(patient.getId())
                .stream().map(this::convertToDto).toList();
    }

    public List<AppointmentDto> getPatientAppointmentsByEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return getPatientAppointments(user.getId());
    }

    public List<AppointmentDto> getAppointmentsByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user is patient
        try {
            Patient patient = patientRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
            return appointmentRepository.findByPatientId(patient.getId())
                    .stream().map(this::convertToDto).toList();
        } catch (ResourceNotFoundException e) {
            // User might be a doctor, return empty list
            return List.of();
        }
    }

    public List<AppointmentDto> getDoctorAppointmentsByEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        return appointmentRepository.findByDoctorId(doctor.getId())
                .stream().map(this::convertToDto).toList();
    }

    public AppointmentDto acceptAppointment(Long appointmentId, String doctorEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        User doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (!appointment.getDoctor().getUser().getId().equals(doctor.getId())) {
            throw new BadRequestException("Only assigned doctor can accept appointment");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment = appointmentRepository.save(appointment);
        return convertToDto(appointment);
    }

    public AppointmentDto rejectAppointment(Long appointmentId, String doctorEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        User doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (!appointment.getDoctor().getUser().getId().equals(doctor.getId())) {
            throw new BadRequestException("Only assigned doctor can reject appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment = appointmentRepository.save(appointment);
        return convertToDto(appointment);
    }

    public List<AppointmentDto> getDoctorAppointments(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        return appointmentRepository.findByDoctorId(doctor.getId())
                .stream().map(this::convertToDto).toList();
    }

    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    private AppointmentDto convertToDto(Appointment appointment) {
        return AppointmentDto.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getUser().getName())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getUser().getName())
                .doctorSpecialization(appointment.getDoctor().getSpecialization())
                .appointmentDate(appointment.getAppointmentDate().toLocalDate())
                .appointmentTime(appointment.getAppointmentTime())
                .status(appointment.getStatus().toString())
                .notes(appointment.getNotes())
                .build();
    }
}
