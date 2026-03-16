package com.doctorapp.service;

import com.doctorapp.dto.DoctorAvailabilityDto;
import com.doctorapp.entity.Doctor;
import com.doctorapp.entity.DoctorAvailability;
import com.doctorapp.entity.User;
import com.doctorapp.exception.BadRequestException;
import com.doctorapp.exception.ResourceNotFoundException;
import com.doctorapp.repository.DoctorAvailabilityRepository;
import com.doctorapp.repository.DoctorRepository;
import com.doctorapp.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@Transactional
public class DoctorAvailabilityService {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    public DoctorAvailabilityDto addAvailability(String doctorEmail, DoctorAvailabilityDto dto) {
        Doctor doctor = getDoctorByEmail(doctorEmail);
        validateAvailability(dto);

        DoctorAvailability availability = DoctorAvailability.builder()
                .doctor(doctor)
                .dayOfWeek(dto.getDayOfWeek().trim().toUpperCase())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();

        availability = availabilityRepository.save(availability);
        return convertToDto(availability);
    }

    public List<DoctorAvailabilityDto> getAvailabilityByDoctorId(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId)
                .stream().map(this::convertToDto).toList();
    }

    public List<DoctorAvailabilityDto> getAvailabilityByDoctorIdAndDay(Long doctorId, String dayOfWeek) {
        return availabilityRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek)
                .stream().map(this::convertToDto).toList();
    }

    public List<DoctorAvailabilityDto> getAvailabilityByDoctorEmail(String doctorEmail) {
        Doctor doctor = getDoctorByEmail(doctorEmail);
        return getAvailabilityByDoctorId(doctor.getId());
    }

    public List<DoctorAvailabilityDto> saveWeeklyAvailability(String doctorEmail, List<DoctorAvailabilityDto> slots, boolean replaceExisting) {
        Doctor doctor = getDoctorByEmail(doctorEmail);

        if (replaceExisting) {
            availabilityRepository.deleteByDoctorId(doctor.getId());
        }

        List<DoctorAvailabilityDto> saved = new ArrayList<>();
        for (DoctorAvailabilityDto dto : slots) {
            validateAvailability(dto);
            DoctorAvailability availability = DoctorAvailability.builder()
                    .doctor(doctor)
                    .dayOfWeek(dto.getDayOfWeek().trim().toUpperCase())
                    .startTime(dto.getStartTime())
                    .endTime(dto.getEndTime())
                    .build();
            saved.add(convertToDto(availabilityRepository.save(availability)));
        }

        return saved;
    }

    public void deleteAvailability(Long availabilityId) {
        availabilityRepository.deleteById(availabilityId);
    }

    private Doctor getDoctorByEmail(String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
    }

    private void validateAvailability(DoctorAvailabilityDto dto) {
        if (dto.getDayOfWeek() == null || dto.getDayOfWeek().trim().isEmpty()) {
            throw new BadRequestException("Day of week is required");
        }
        if (dto.getStartTime() == null || dto.getStartTime().trim().isEmpty()) {
            throw new BadRequestException("Start time is required");
        }
        if (dto.getEndTime() == null || dto.getEndTime().trim().isEmpty()) {
            throw new BadRequestException("End time is required");
        }
        if (dto.getStartTime().compareTo(dto.getEndTime()) >= 0) {
            throw new BadRequestException("End time must be after start time");
        }
    }

    private DoctorAvailabilityDto convertToDto(DoctorAvailability availability) {
        return DoctorAvailabilityDto.builder()
                .id(availability.getId())
                .doctorId(availability.getDoctor().getId())
                .dayOfWeek(availability.getDayOfWeek())
                .startTime(availability.getStartTime())
                .endTime(availability.getEndTime())
                .build();
    }
}
