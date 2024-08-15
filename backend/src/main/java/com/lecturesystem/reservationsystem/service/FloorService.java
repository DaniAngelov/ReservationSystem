package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.FloorDTO;
import com.lecturesystem.reservationsystem.model.entity.Floor;

import java.util.List;

public interface FloorService {
    Floor addFloor(FloorDTO floorDTO) throws CustomUserException;

    List<Floor> getAllFloors();
}
