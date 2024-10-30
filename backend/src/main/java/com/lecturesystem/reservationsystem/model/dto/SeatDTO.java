package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.enums.SeatType;
import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class SeatDTO {
    private String seatNumber;
    private boolean seatTaken;
    private boolean occupiesComputer;
    private boolean occupiesCharger;
    private Integer occupiesComputerNumber;
    private Integer occupiesChargerNumber;
    private String userThatOccupiedSeat;
    private String userRole;
    private SeatType seatType;
}
