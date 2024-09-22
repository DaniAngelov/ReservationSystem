package com.lecturesystem.reservationsystem.model.util;

import com.lecturesystem.reservationsystem.model.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacultyWrapper {
    private String facultyName;
    private Room room;
    private Integer floorNumber;
}
