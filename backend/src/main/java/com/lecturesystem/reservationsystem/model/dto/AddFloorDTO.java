package com.lecturesystem.reservationsystem.model.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AddFloorDTO {
    private FloorDTO floorDTO;
    private String facultyName;
}
