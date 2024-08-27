package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.AuthenticationResponseDTO;
import com.lecturesystem.reservationsystem.model.dto.users.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import jakarta.mail.MessagingException;

public interface UserService {
    AuthenticationResponseDTO registerUser(UserDTO userDto) throws CustomUserException;

    AuthenticationResponseDTO loginUser(UserLoginDTO userLoginDTO) throws CustomUserException;

    void reserveSpot(UserReserveSpotDTO userReserveSpotDTO) throws CustomUserException, CustomEventException;

    void releaseSpot(UserReleaseSpotDTO userReleaseSpotDTO) throws CustomUserException, CustomEventException;

    User2FADTO generate2FA(User2FAAuthenticationRequestDTO user2FAAuthenticationRequestDTO) throws CustomUserException, QrGenerationException;

    void verifyCode(VerificationRequestDTO verificationRequestDTO) throws CustomUserException;

    void sendMessageToEmail(String email) throws CustomUserException, MessagingException;

    void updatePassword(String password) throws CustomUserException;
}
