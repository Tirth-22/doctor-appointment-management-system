package com.doctorapp.service;

import com.doctorapp.dto.DoctorDto;
import com.doctorapp.dto.PatientDto;
import com.doctorapp.entity.*;
import com.doctorapp.exception.ResourceNotFoundException;
import com.doctorapp.repository.DoctorRepository;
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
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DoctorDto> getAllDoctors() {
        return doctorRepository.findAll().stream().map(this::convertToDto).toList();
    }

    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return convertToDto(doctor);
    }

    public DoctorDto getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return convertToDto(doctor);
    }

    public List<DoctorDto> searchDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization)
                .stream().map(this::convertToDto).toList();
    }

    public List<DoctorDto> searchDoctorsByName(String name) {
        return doctorRepository.findByUserNameContainingIgnoreCase(name)
                .stream().map(this::convertToDto).toList();
    }

    public List<DoctorDto> searchDoctorsByHospital(String hospital) {
        return doctorRepository.findByHospitalContainingIgnoreCase(hospital)
                .stream().map(this::convertToDto).toList();
    }

    public List<DoctorDto> searchDoctors(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllDoctors();
        }
        return doctorRepository.searchFullText(query.trim())
                .stream().map(this::convertToDto).toList();
    }

    public DoctorDto updateDoctorProfile(Long userId, DoctorDto dto) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperience(dto.getExperience());
        doctor.setHospital(dto.getHospital());
        doctor.setBio(dto.getBio());

        doctor = doctorRepository.save(doctor);
        return convertToDto(doctor);
    }

    private DoctorDto convertToDto(Doctor doctor) {
        return DoctorDto.builder()
                .id(doctor.getId())
                .userId(doctor.getUser().getId())
                .name(doctor.getUser().getName())
                .email(doctor.getUser().getEmail())
                .specialization(doctor.getSpecialization())
                .experience(doctor.getExperience())
                .hospital(doctor.getHospital())
                .bio(doctor.getBio())
                .build();
    }
}
