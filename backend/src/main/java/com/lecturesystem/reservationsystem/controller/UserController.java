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
import dev.samstevens.totp.exceptions.QrGenerationException;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static java.util.stream.Collectors.toList;


@CrossOrigin("*")
@RestController
@RequestMapping("api/users")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    private final UserRepository userRepository;

    private final ModelMapper modelMapper = new ModelMapper();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody UserDTO userDto) throws CustomUserException {
        AuthenticationResponseDTO authenticationResponseDTO = userService.registerUser(userDto);
        return new ResponseEntity<>(authenticationResponseDTO, HttpStatus.CREATED);
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdminJSON() throws CustomUserException, IOException {
        Path path = Paths.get("backend/src/main/resources/adminData.json");
        String name = "adminData.json";
        String originalFileName = "adminData.json";
        String contentType = "application/json";
        byte[] content;
        try {
            content = Files.readAllBytes(path);
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
        if (userRepository.getUserByUsername("admin") == null) {
            registerAdmin(new MockMultipartFile(name,
                    originalFileName, contentType, content));
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
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
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
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

    @GetMapping("/delete-inactive-users")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<?> deleteInactiveUsers() {
        userService.deleteInactiveUsers();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/get-users")
    @PreAuthorize("hasAnyAuthority('ADMIN','LECTOR')")
    public ResponseEntity<List<GetUserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<GetUserDTO> userDTOS = users.stream().map(event -> modelMapper.map(event, GetUserDTO.class)).collect(toList());
        return new ResponseEntity<>(userDTOS, HttpStatus.OK);
    }

    @PutMapping("/release")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<?> releaseSpot(@RequestBody UserReleaseSpotDTO userReleaseSpotDTO) throws CustomUserException, CustomEventException {
        userService.releaseSpot(userReleaseSpotDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/enable-2fa")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<EnableTwoFactorAuthenticationResponseDTO> enableTwoFactorAuthentication(@RequestBody EnableTwoFactorAuthenticationDTO enableTwoFactorAuthenticationDTO) throws CustomUserException {
        EnableTwoFactorAuthenticationResponseDTO enableTwoFactorAuthenticationResponseDTO = userService.enableOrDisableTwoFactorAuthentication(enableTwoFactorAuthenticationDTO);
        return new ResponseEntity<>(enableTwoFactorAuthenticationResponseDTO, HttpStatus.OK);
    }

    @PutMapping("/generate-2fa")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<User2FADTO> generateTwoFactorAuthentication(@RequestBody User2FAAuthenticationRequestDTO user2FAAuthenticationRequestDTO) throws QrGenerationException, CustomUserException {
        User2FADTO user2FADTO = userService.generate2FA(user2FAAuthenticationRequestDTO);
        return new ResponseEntity<>(user2FADTO, HttpStatus.OK);
    }

    @PutMapping("/verify-code")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequestDTO verificationRequestDTO) throws CustomUserException {
        userService.verifyCode(verificationRequestDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/enable-one-time-pass")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<EnableOneTimePassResponseDTO> enableOneTimePass(@RequestBody EnableOneTimePassDTO enableOneTimePassDTO) throws CustomUserException {
        EnableOneTimePassResponseDTO enableOneTimePassResponseDTO = userService.enableOrDisableOneTimePass(enableOneTimePassDTO);
        return new ResponseEntity<>(enableOneTimePassResponseDTO, HttpStatus.OK);
    }

    @PutMapping("/generate-one-time-pass")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<?> sendOneTimePassCode(@RequestBody OneTimePassCodeRequestDTO oneTimePassCodeRequestDTO) throws CustomUserException, MessagingException {
        userService.sendOneTimePassCode(oneTimePassCodeRequestDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/verify-one-time-code")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
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

    @GetMapping("/get-admin")
    public ResponseEntity<Boolean> getAdmin() {
        boolean adminFound = userService.getAdmin();
        return new ResponseEntity<>(adminFound, HttpStatus.OK);
    }

    @GetMapping("/user-points")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<UserPointsDTO> getUserWithPoints(@RequestParam String username) throws CustomUserException {
        User user = userService.getUserByUsername(username);
        UserPointsDTO userDTO = modelMapper.map(user, UserPointsDTO.class);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PutMapping("/search")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<List<UserPointsDTO>> searchEvent(@RequestBody SearchGuestDTO searchUserDTO) {
        List<User> users = userService.searchUser(searchUserDTO);
        List<UserPointsDTO> userDTOS = users.stream().map(user -> modelMapper.map(user, UserPointsDTO.class)).collect(toList());
        return new ResponseEntity<>(userDTOS, HttpStatus.OK);
    }

    @GetMapping("/check-password")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<Boolean> checkPassword(@RequestParam String username) throws CustomUserException {
        boolean result = userService.checkPassword(username);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/language")
    public ResponseEntity<UserPointsDTO> changeLanguage(@RequestBody ChangeUserLanguageDTO changeUserLanguageDTO) throws CustomUserException {
        User user = userService.changeLanguage(changeUserLanguageDTO);
        UserPointsDTO userDTO = modelMapper.map(user, UserPointsDTO.class);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PutMapping("/color-theme")
    public ResponseEntity<UserPointsDTO> changeTheme(@RequestBody ChangeUserThemeDTO changeUserThemeDTO) throws CustomUserException {
        User user = userService.changeTheme(changeUserThemeDTO);
        UserPointsDTO userDTO = modelMapper.map(user, UserPointsDTO.class);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    private void registerAdmin(@ModelAttribute MultipartFile file) throws IOException, CustomUserException {
        objectMapper.registerModule(new JavaTimeModule());
        UserDTO userDto = objectMapper.readValue(file.getInputStream(), UserDTO.class);
        userService.registerUser(userDto);
    }

}
