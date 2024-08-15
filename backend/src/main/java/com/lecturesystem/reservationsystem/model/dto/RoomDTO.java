package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.entity.Floor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class RoomDTO {
    private Integer roomNumber;
    private List<SeatDTO> seats;
    private List<EventDTO> events;
}
