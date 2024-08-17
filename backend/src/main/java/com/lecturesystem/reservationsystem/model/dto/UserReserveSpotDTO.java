package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.entity.Seat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserReserveSpotDTO {
    private String username;
    private String eventName;
    private Seat seat;
    private int floorNumber;
    private int roomNumber;
}
