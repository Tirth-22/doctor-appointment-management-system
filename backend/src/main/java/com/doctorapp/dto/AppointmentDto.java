package com.doctorapp.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDto {

    private Long id;
    private Long patientId;
    private Long doctorId;
    private String patientName;
    private String doctorName;
    private String doctorSpecialization;

    @NotNull
    @FutureOrPresent(message = "Appointment date cannot be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;

    @NotBlank
    private String appointmentTime;

    private String status;
    private String notes;
}
