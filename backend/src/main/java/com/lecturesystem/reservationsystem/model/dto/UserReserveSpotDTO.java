package com.lecturesystem.reservationsystem.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserReserveSpotDTO {
    private String username;
    private String eventName;
    private SeatDTO seat;
}
