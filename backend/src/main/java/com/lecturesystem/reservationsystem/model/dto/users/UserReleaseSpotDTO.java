package com.lecturesystem.reservationsystem.model.dto.users;

import com.lecturesystem.reservationsystem.model.dto.SeatDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserReleaseSpotDTO {
    private String username;
    private String eventName;
    private SeatDTO seat;
    private int floorNumber;
    private int roomNumber;
}
