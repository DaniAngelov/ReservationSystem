package com.lecturesystem.reservationsystem.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddRoomImageDTO {
    private Integer roomNumber;
    private String roomImage;
    private Integer floorNumber;
    private String facultyName;
}
