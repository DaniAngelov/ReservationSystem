package com.lecturesystem.reservationsystem.model.dto.export;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ExportFloorDTO {
    private Integer floorNumber;
    private List<ExportRoomDTO> rooms;
}
