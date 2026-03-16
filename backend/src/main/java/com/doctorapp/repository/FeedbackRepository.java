package com.doctorapp.repository;

import com.doctorapp.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByDoctorId(Long doctorId);

    List<Feedback> findByPatientId(Long patientId);

    List<Feedback> findByAppointmentId(Long appointmentId);

    Optional<Feedback> findByAppointmentIdAndPatientId(Long appointmentId, Long patientId);

    void deleteByDoctorId(Long doctorId);

    void deleteByPatientId(Long patientId);
}
