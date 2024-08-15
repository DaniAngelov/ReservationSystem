package com.lecturesystem.reservationsystem.model.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class DurationDTO {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
