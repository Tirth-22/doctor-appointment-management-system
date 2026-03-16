package com.doctorapp.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDto {

    private Long id;
    private Long userId;
    private String name;
    private String email;

    @NotNull
    private Integer age;

    @NotBlank
    private String gender;

    @NotBlank
    private String phone;
}
