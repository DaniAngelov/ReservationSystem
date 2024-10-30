package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.dto.users.UserDTO;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class TeamDTO {
    private String name;
    private Integer seats;
    private Integer qaSeats;
    private Integer developerSeats;
    private Integer devopsSeats;
    private String eventName;
    private int floorNumber;
    private String facultyName;
    private List<UserDTO> users;
    private int roomNumber;
    private boolean occupiesComputer;
    private int occupiesComputerNumber;
    private int occupiesChargerNumber;
    private boolean occupiesCharger;
}
