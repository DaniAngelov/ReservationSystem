package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.users.UserDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserLoginDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserReleaseSpotDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserReserveSpotDTO;
import com.lecturesystem.reservationsystem.model.entity.User;

public interface UserService {
    User registerUser(UserDTO userDto) throws CustomUserException;

    void loginUser(UserLoginDTO userLoginDTO) throws CustomUserException;

    void reserveSpot(UserReserveSpotDTO userReserveSpotDTO) throws CustomUserException, CustomEventException;

    void releaseSpot(UserReleaseSpotDTO userReleaseSpotDTO) throws CustomUserException, CustomEventException;
}
