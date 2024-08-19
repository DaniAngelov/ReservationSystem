package com.lecturesystem.reservationsystem.controller;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.users.UserDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserLoginDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserReleaseSpotDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserReserveSpotDTO;
import com.lecturesystem.reservationsystem.model.entity.User;
import com.lecturesystem.reservationsystem.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController
@RequestMapping("api/users")
public class UserController {
    private final UserService userService;

    private final ModelMapper modelMapper = new ModelMapper();

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDto) throws CustomUserException {
        User user = userService.registerUser(userDto);
        return new ResponseEntity<>(modelMapper.map(user, UserDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO userLoginDTO) throws CustomUserException {
        userService.loginUser(userLoginDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/reserve")
    public ResponseEntity<?> reserveSpot(@RequestBody UserReserveSpotDTO userReserveSpotDTO) throws CustomUserException, CustomEventException {
        userService.reserveSpot(userReserveSpotDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/release")
    public ResponseEntity<?> releaseSpot(@RequestBody UserReleaseSpotDTO userReleaseSpotDTO) throws CustomUserException, CustomEventException {
        userService.releaseSpot(userReleaseSpotDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//
//    @PutMapping("/forgotten-password")
//    public ResponseEntity<?> pa(@RequestBody UserReserveSpotDTO userReserveSpotDTO) throws CustomUserException, CustomEventException {
//        userService.reserveSpot(userReserveSpotDTO);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
}
