package com.lecturesystem.reservationsystem.model.dto;

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
}
