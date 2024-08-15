package com.lecturesystem.reservationsystem.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class FloorDTO {
    private Integer floorNumber;
    private List<RoomDTO> rooms;
}
