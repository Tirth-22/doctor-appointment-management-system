package com.doctorapp.repository;

import com.doctorapp.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByUserId(Long userId);

    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    List<Doctor> findByUserNameContainingIgnoreCase(String name);

    List<Doctor> findByHospitalContainingIgnoreCase(String hospital);

    @Query("SELECT d FROM Doctor d WHERE "
            + "LOWER(d.user.name) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(d.hospital) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Doctor> searchFullText(@Param("query") String query);
}
