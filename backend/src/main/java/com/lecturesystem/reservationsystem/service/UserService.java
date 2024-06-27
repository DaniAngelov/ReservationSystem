package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.UserDTO;
import com.lecturesystem.reservationsystem.model.dto.UserLoginDTO;
import com.lecturesystem.reservationsystem.model.entity.User;

public interface UserService {
    User registerUser(UserDTO userDto) throws CustomUserException;
    void loginUser(UserLoginDTO userLoginDTO) throws CustomUserException;
}
