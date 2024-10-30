package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.dto.event.EventDTO;
import com.lecturesystem.reservationsystem.model.enums.RoomType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class RoomDTO {
    private Integer roomNumber;
    private List<EventDTO> events;
    private RoomType roomType;
    private int seatsNumber;
    private int developerSeatsNumber;
    private int qaSeatsNumber;
    private int devopsSeatsNumber;
    private String roomImage;
    private Integer floorNumber;
    private String facultyName;
}
