package com.lecturesystem.reservationsystem.model.dto.export;

import com.lecturesystem.reservationsystem.model.enums.RoomType;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ExportRoomDTO {
    private Integer roomNumber;
    private List<ExportEventDTO> events;
    private RoomType roomType;
    private int seatsNumber;
}
