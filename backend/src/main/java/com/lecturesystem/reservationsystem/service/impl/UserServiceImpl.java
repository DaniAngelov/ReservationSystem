package com.lecturesystem.reservationsystem.service.impl;

import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.UserDTO;
import com.lecturesystem.reservationsystem.model.dto.UserLoginDTO;
import com.lecturesystem.reservationsystem.model.entity.User;
import com.lecturesystem.reservationsystem.repository.UserRepository;
import com.lecturesystem.reservationsystem.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(UserDTO userDto) throws CustomUserException {
        User userByUsername = userRepository.getUserByUsername(userDto.getUsername());

        if (userByUsername != null) {
            throw new CustomUserException("User already registered!");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        user.setLastActive(LocalDateTime.now());

        return userRepository.save(user);
    }

    @Override
    public void loginUser(UserLoginDTO userLoginDTO) throws CustomUserException {
        User user = userRepository.getUserByUsername(userLoginDTO.getUsername());
        if (user == null || !user.getPassword().equals(userLoginDTO.getPassword())) {
            throw new CustomUserException("Wrong credentials! Please try again!");
        }
        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);
    }
}
