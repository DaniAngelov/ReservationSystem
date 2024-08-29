package com.lecturesystem.reservationsystem.model.dto.event;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class SearchEventDTO {
    private Integer floorNumber;
    private Integer roomNumber;
    private String searchField;
    private String facultyName;
}
