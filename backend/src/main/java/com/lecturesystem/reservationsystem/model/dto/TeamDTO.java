package com.lecturesystem.reservationsystem.model.dto;

import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class TeamDTO {
    private String name;
    private Integer seats;
    private String eventName;
    private int floorNumber;
    private String facultyName;
    private int roomNumber;
    private boolean occupiesComputer;
    private boolean occupiesCharger;
}
