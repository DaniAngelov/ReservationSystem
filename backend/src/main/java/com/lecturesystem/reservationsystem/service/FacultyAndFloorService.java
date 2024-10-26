package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.AddRoomImageDTO;
import com.lecturesystem.reservationsystem.model.dto.FacultyDTO;
import com.lecturesystem.reservationsystem.model.dto.export.ExportFacultyDTO;
import com.lecturesystem.reservationsystem.model.entity.Faculty;

import java.sql.SQLException;
import java.util.List;

public interface FacultyAndFloorService {
    void addFaculty(FacultyDTO facultyDTO) throws CustomUserException, SQLException;

    void addRoomImage(AddRoomImageDTO addRoomImageDTO) throws SQLException;

    List<Faculty> getAllFloors();

    List<ExportFacultyDTO> getWrapperDTO();

    boolean checkEventExist();
}
