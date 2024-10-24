package com.lecturesystem.reservationsystem.model.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class FacultyDTO {
    private String name;
    private List<FloorDTO> floors;
}
