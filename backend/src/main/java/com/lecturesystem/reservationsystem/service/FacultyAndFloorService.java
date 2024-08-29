package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.FacultyDTO;
import com.lecturesystem.reservationsystem.model.entity.Faculty;

import java.util.List;

public interface FacultyAndFloorService {
    void addFaculty(FacultyDTO facultyDTO) throws CustomUserException;

    List<Faculty> getAllFloors();
}
