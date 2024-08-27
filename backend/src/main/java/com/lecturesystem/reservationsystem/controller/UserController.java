package com.lecturesystem.reservationsystem.controller;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.AuthenticationResponseDTO;
import com.lecturesystem.reservationsystem.model.dto.users.*;
import com.lecturesystem.reservationsystem.repository.UserRepository;
import com.lecturesystem.reservationsystem.service.UserService;
import com.lecturesystem.reservationsystem.service.impl.TwoFactorAuthenticationService;
import dev.samstevens.totp.exceptions.QrGenerationException;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController
@RequestMapping("api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService, TwoFactorAuthenticationService twoFactorAuthenticationService, UserRepository userRepository) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody UserDTO userDto) throws CustomUserException {
        AuthenticationResponseDTO authenticationResponseDTO = userService.registerUser(userDto);
        return new ResponseEntity<>(authenticationResponseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@RequestBody UserLoginDTO userLoginDTO) throws CustomUserException {
        AuthenticationResponseDTO authenticationResponseDTO = userService.loginUser(userLoginDTO);
        return new ResponseEntity<>(authenticationResponseDTO, HttpStatus.OK);
    }

    @PutMapping("/forgotten-password")
    public ResponseEntity<?> forgottenPassword(@RequestBody UserForgottenPasswordDTO userForgottenPasswordDTO) throws CustomUserException, MessagingException {
        userService.sendMessageToEmail(userForgottenPasswordDTO.getEmail());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody UserUpdatePasswordDTO userUpdatePasswordDTO) throws CustomUserException {
        userService.updatePassword(userUpdatePasswordDTO.getPassword());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/reserve")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER','LECTOR')")
    public ResponseEntity<?> reserveSpot(@RequestBody UserReserveSpotDTO userReserveSpotDTO) throws CustomUserException, CustomEventException {
        userService.reserveSpot(userReserveSpotDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/release")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER','LECTOR')")
    public ResponseEntity<?> releaseSpot(@RequestBody UserReleaseSpotDTO userReleaseSpotDTO) throws CustomUserException, CustomEventException {
        userService.releaseSpot(userReleaseSpotDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/generate-2fa")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER','LECTOR')")
    public ResponseEntity<User2FADTO> generateTwoFactorAuthentication(@RequestBody User2FAAuthenticationRequestDTO user2FAAuthenticationRequestDTO) throws QrGenerationException, CustomUserException {
        User2FADTO user2FADTO = userService.generate2FA(user2FAAuthenticationRequestDTO);
        return new ResponseEntity<>(user2FADTO, HttpStatus.OK);
    }

    @PutMapping("/verify-code")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER','LECTOR')")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequestDTO verificationRequestDTO) throws CustomUserException {
        userService.verifyCode(verificationRequestDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//
//    @PutMapping("/forgotten-password")
//    public ResponseEntity<?> pa(@RequestBody UserReserveSpotDTO userReserveSpotDTO) throws CustomUserException, CustomEventException {
//        userService.reserveSpot(userReserveSpotDTO);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
}
