package com.lecturesystem.reservationsystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.AuthenticationResponseDTO;
import com.lecturesystem.reservationsystem.model.dto.TeamDTO;
import com.lecturesystem.reservationsystem.model.dto.users.*;
import com.lecturesystem.reservationsystem.model.entity.User;
import com.lecturesystem.reservationsystem.repository.UserRepository;
import com.lecturesystem.reservationsystem.service.UserService;
import com.lecturesystem.reservationsystem.service.impl.TwoFactorAuthenticationService;
import dev.samstevens.totp.exceptions.QrGenerationException;
import jakarta.mail.MessagingException;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static java.util.stream.Collectors.toList;


@CrossOrigin("*")
@RestController
@RequestMapping("api/users")
public class UserController {
    private final UserService userService;

    private final ModelMapper modelMapper = new ModelMapper();

    private final ObjectMapper objectMapper = new ObjectMapper();


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

    @PutMapping("/reserve-team")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'LECTOR')")
    public void reserveSpotTeam(@RequestBody TeamDTO teamDTO) throws CustomUserException, CustomEventException {
        userService.reserveSpotTeam(teamDTO);
        new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/reserve-team-json")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'LECTOR')")
    public ResponseEntity<?> reserveSpotTeamJSON(@ModelAttribute MultipartFile file) throws CustomUserException, CustomEventException, IOException {
        objectMapper.registerModule(new JavaTimeModule());
        TeamDTO teamDTO = objectMapper.readValue(file.getInputStream(), TeamDTO.class);
        reserveSpotTeam(teamDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/release")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER','LECTOR')")
    public ResponseEntity<?> releaseSpot(@RequestBody UserReleaseSpotDTO userReleaseSpotDTO) throws CustomUserException, CustomEventException {
        userService.releaseSpot(userReleaseSpotDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/enable-2fa")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER','LECTOR')")
    public ResponseEntity<EnableTwoFactorAuthenticationResponseDTO> enableTwoFactorAuthentication(@RequestBody EnableTwoFactorAuthenticationDTO enableTwoFactorAuthenticationDTO) throws CustomUserException {
        EnableTwoFactorAuthenticationResponseDTO enableTwoFactorAuthenticationResponseDTO = userService.enableOrDisableTwoFactorAuthentication(enableTwoFactorAuthenticationDTO);
        return new ResponseEntity<>(enableTwoFactorAuthenticationResponseDTO, HttpStatus.OK);
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

    @PutMapping("/enable-one-time-pass")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER','LECTOR')")
    public ResponseEntity<EnableOneTimePassResponseDTO> enableOneTimePass(@RequestBody EnableOneTimePassDTO enableOneTimePassDTO) throws CustomUserException {
        EnableOneTimePassResponseDTO enableOneTimePassResponseDTO = userService.enableOrDisableOneTimePass(enableOneTimePassDTO);
        return new ResponseEntity<>(enableOneTimePassResponseDTO, HttpStatus.OK);
    }

    @PutMapping("/generate-one-time-pass")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER','LECTOR')")
    public ResponseEntity<?> sendOneTimePassCode(@RequestBody OneTimePassCodeRequestDTO oneTimePassCodeRequestDTO) throws CustomUserException, MessagingException {
        userService.sendOneTimePassCode(oneTimePassCodeRequestDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/verify-one-time-code")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER','LECTOR')")
    public ResponseEntity<?> verifyOneTimePassCode(@RequestBody OneTimePassVerificationDTO oneTimePassVerificationDTO) throws CustomUserException {
        userService.verifyOnePassCode(oneTimePassVerificationDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/add-link-to-page")
    @PreAuthorize("hasAnyAuthority('ADMIN','LECTOR')")
    public ResponseEntity<?> addLinkToPage(@RequestBody AddLinkToPageDTO addLinkToPageDTO) throws CustomUserException {
        userService.addLinkToPage(addLinkToPageDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/get-users")
    @PreAuthorize("hasAnyAuthority('ADMIN','LECTOR')")
    public ResponseEntity<List<GetUserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<GetUserDTO> userDTOS = users.stream().map(event -> modelMapper.map(event, GetUserDTO.class)).collect(toList());
        return new ResponseEntity<>(userDTOS, HttpStatus.OK);
    }

    @GetMapping("/user-points")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'USER', 'ADMIN')")
    public ResponseEntity<UserPointsDTO> getUserWithPoints(@RequestParam String username) throws CustomUserException {
        User user = userService.getUserByUsername(username);
        UserPointsDTO userDTO = modelMapper.map(user, UserPointsDTO.class);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PutMapping("/search")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN')")
    public ResponseEntity<List<UserPointsDTO>> searchEvent(@RequestBody SearchGuestDTO searchUserDTO) {
        List<User> users = userService.searchUser(searchUserDTO);
        List<UserPointsDTO> userDTOS = users.stream().map(user -> modelMapper.map(user, UserPointsDTO.class)).collect(toList());
        return new ResponseEntity<>(userDTOS, HttpStatus.OK);
    }

    @PutMapping("/language")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN')")
    public ResponseEntity<?> changeLanguage(@RequestBody ChangeUserLanguageDTO changeUserLanguageDTO) throws CustomUserException {
        userService.changeLanguage(changeUserLanguageDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
