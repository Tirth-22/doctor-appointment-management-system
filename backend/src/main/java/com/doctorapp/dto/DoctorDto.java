package com.doctorapp.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDto {

    private Long id;
    private Long userId;
    private String name;
    private String email;

    @NotBlank
    private String specialization;

    @NotNull
    private Integer experience;

    @NotBlank
    private String hospital;

    private String bio;
}
