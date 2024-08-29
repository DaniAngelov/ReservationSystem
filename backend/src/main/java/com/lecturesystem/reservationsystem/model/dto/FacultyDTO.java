package com.lecturesystem.reservationsystem.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class FacultyDTO {
    private String name;
    private List<FloorDTO> floors;
}
