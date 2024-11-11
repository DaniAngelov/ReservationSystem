package com.lecturesystem.reservationsystem.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class DurationDTO {
    private String startDate;
    private String endDate;
}
