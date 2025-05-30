package com.lecturesystem.reservationsystem.model.dto.export;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ExportFacultyDTO {
    private String name;
    private List<ExportFloorDTO> floors;
}
