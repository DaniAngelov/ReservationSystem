package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.AuthenticationResponseDTO;
import com.lecturesystem.reservationsystem.model.dto.TeamDTO;
import com.lecturesystem.reservationsystem.model.dto.users.*;
import com.lecturesystem.reservationsystem.model.entity.User;
import dev.samstevens.totp.exceptions.QrGenerationException;
import jakarta.mail.MessagingException;

import java.util.List;

public interface UserService {
    AuthenticationResponseDTO registerUser(UserDTO userDto) throws CustomUserException;

    void registerAdmin(RegisterAdminDTO registerAdminDTO) throws CustomUserException;

    boolean getAdmin();

    AuthenticationResponseDTO loginUser(UserLoginDTO userLoginDTO) throws CustomUserException;

    void reserveSpot(UserReserveSpotDTO userReserveSpotDTO) throws CustomUserException, CustomEventException;

    void reserveSpotTeam(TeamDTO teamDTO) throws CustomEventException, CustomUserException;

    void releaseSpot(UserReleaseSpotDTO userReleaseSpotDTO) throws CustomUserException, CustomEventException;

    User2FADTO generate2FA(User2FAAuthenticationRequestDTO user2FAAuthenticationRequestDTO) throws CustomUserException, QrGenerationException;

    void verifyCode(VerificationRequestDTO verificationRequestDTO) throws CustomUserException;

    void sendMessageToEmail(String email) throws CustomUserException, MessagingException;

    void sendOneTimePassCode(OneTimePassCodeRequestDTO oneTimePassCodeRequestDTO) throws CustomUserException, MessagingException;

    void updatePassword(String password) throws CustomUserException;

    void verifyOnePassCode(OneTimePassVerificationDTO oneTimePassVerificationDTO) throws CustomUserException;

    EnableOneTimePassResponseDTO enableOrDisableOneTimePass(EnableOneTimePassDTO enableOneTimePassDTO) throws CustomUserException;

    EnableTwoFactorAuthenticationResponseDTO enableOrDisableTwoFactorAuthentication(EnableTwoFactorAuthenticationDTO enableTwoFactorAuthenticationDTO) throws CustomUserException;

    void addLinkToPage(AddLinkToPageDTO addLinkToPageDTO) throws CustomUserException;

    List<User> getAllUsers();

    User getUserByUsername(String user) throws CustomUserException;

    List<User> searchUser(SearchGuestDTO searchGuestDTO);

    User changeLanguage(ChangeUserLanguageDTO changeUserLanguageDTO) throws CustomUserException;

    void deleteInactiveUsers();
}
