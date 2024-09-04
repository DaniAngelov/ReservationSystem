package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.enums.SeatType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class SeatDTO {
    private String seatNumber;
    private boolean seatTaken;
    private boolean occupiesComputer;
    private boolean occupiesCharger;
    private String userThatOccupiedSeat;
    private SeatType seatType;
}
