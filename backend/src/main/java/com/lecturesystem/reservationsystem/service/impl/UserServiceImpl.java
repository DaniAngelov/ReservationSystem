package com.lecturesystem.reservationsystem.service.impl;

import com.lecturesystem.reservationsystem.config.JwtService;
import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.AuthenticationResponseDTO;
import com.lecturesystem.reservationsystem.model.dto.SeatDTO;
import com.lecturesystem.reservationsystem.model.dto.users.*;
import com.lecturesystem.reservationsystem.model.entity.*;
import com.lecturesystem.reservationsystem.model.enums.Role;
import com.lecturesystem.reservationsystem.model.enums.RoomType;
import com.lecturesystem.reservationsystem.repository.EventRepository;
import com.lecturesystem.reservationsystem.repository.FacultyRepository;
import com.lecturesystem.reservationsystem.repository.SeatRepository;
import com.lecturesystem.reservationsystem.repository.UserRepository;
import com.lecturesystem.reservationsystem.service.UserService;
import dev.samstevens.totp.exceptions.QrGenerationException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final EventRepository eventRepository;

    private final FacultyRepository facultyRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final TwoFactorAuthenticationService twoFactorAuthenticationService;

    @Autowired
    private JavaMailSenderImpl javaMailSender;

    @Override
    public AuthenticationResponseDTO registerUser(UserDTO userDto) throws CustomUserException {
        User userByUsername = userRepository.getUserByUsername(userDto.getUsername());

        if (userByUsername != null) {
            throw new CustomUserException("User already registered!");
        }
        User userByEmail = userRepository.getUserByEmail(userDto.getEmail());
        if (userByEmail != null) {
            throw new CustomUserException("User with such email already exists!");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setLanguagePreferred("ENG");
        user.setRole(Role.USER);
        user.setPoints(1);
        user.setLastActive(LocalDateTime.now());
        user.setLinkToPage(new ArrayList<>());
        user.setIsPasswordChangeEnabled(false);
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(new HashMap<>(), user);
        AuthenticationResponseDTO authenticationResponseDTO = new AuthenticationResponseDTO();
        authenticationResponseDTO.setToken(jwtToken);

        return authenticationResponseDTO;
    }

    @Override
    public AuthenticationResponseDTO loginUser(UserLoginDTO userLoginDTO) throws CustomUserException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLoginDTO.getUsername(),
                        userLoginDTO.getPassword()
                )
        );
        User user = userRepository.getUserByUsername(userLoginDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("Wrong credentials! Please try again!");
        }
        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(new HashMap<>(), user);
        AuthenticationResponseDTO authenticationResponseDTO = new AuthenticationResponseDTO();
        authenticationResponseDTO.setToken(jwtToken);

        return authenticationResponseDTO;
    }

    @Override
    public void reserveSpot(UserReserveSpotDTO userReserveSpotDTO) throws CustomUserException, CustomEventException {
        User user = userRepository.getUserByUsername(userReserveSpotDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        Event event = eventRepository.findEventByName(userReserveSpotDTO.getEventName());
        if (event == null) {
            throw new CustomEventException("There is no such event!");
        }
        Faculty faculty = facultyRepository.findFacultyByName(userReserveSpotDTO.getFacultyName());
        if (faculty == null) {
            throw new CustomEventException("There is no such faculty!");
        }
        SeatDTO seatDTO = userReserveSpotDTO.getSeat();
        Seat chosenSeat = new Seat();
        boolean seatFound = false;
        for (Seat seat : event.getSeats()) {
            if (seat.getSeatNumber().equals(seatDTO.getSeatNumber())) {
                chosenSeat = seat;
                seatFound = true;
                break;
            }
        }
        if (!seatFound) {
            throw new CustomUserException("There is no such seat!");
        }
        if (!checkIfUserCanReserveSeat(userReserveSpotDTO)) {
            throw new CustomUserException("You have already reserved seat in this room!");
        }
        if (chosenSeat.isSeatTaken()) {
            throw new CustomUserException("Seat is already taken by another user!");
        }
        if (event.getRoom() == null) {
            throw new CustomUserException("There is no such room!");
        }
        if (event.getRoom().getRoomType().equals(RoomType.COMPUTER)) {
            chosenSeat.setOccupiesCharger(userReserveSpotDTO.isOccupiesCharger());
            chosenSeat.setOccupiesComputer(userReserveSpotDTO.isOccupiesComputer());
        }
        chosenSeat.setSeatTaken(true);
        chosenSeat.setUserThatOccupiedSeat(user.getUsername());
        seatRepository.save(chosenSeat);
        user.setEvents(addEvent(user, user.getEvents(), event));
        user.setLastActive(LocalDateTime.now());
        user.setPoints(user.getPoints() + 1);
        userRepository.save(user);
    }

    @Override
    public void releaseSpot(UserReleaseSpotDTO userReleaseSpotDTO) throws CustomUserException, CustomEventException {
        User user = userRepository.getUserByUsername(userReleaseSpotDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        Event event = eventRepository.findEventByName(userReleaseSpotDTO.getEventName());
        if (event == null) {
            throw new CustomEventException("There is no such event!");
        }
        SeatDTO seatDTO = userReleaseSpotDTO.getSeat();
        Seat chosenSeat = new Seat();
        boolean seatFound = false;
        for (Seat seat : event.getSeats()) {
            if (seat.getSeatNumber().equals(seatDTO.getSeatNumber())) {
                chosenSeat = seat;
                seatFound = true;
                break;
            }
        }
        if (!seatFound) {
            throw new CustomUserException("There is no such seat!");
        }

        if (event.getRoom().getRoomType().equals(RoomType.COMPUTER)) {
            chosenSeat.setOccupiesCharger(false);
            chosenSeat.setOccupiesComputer(false);
        }
        chosenSeat.setSeatTaken(false);
        chosenSeat.setUserThatOccupiedSeat("");
        seatRepository.save(chosenSeat);
        user.getEvents().remove(event);
        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public User2FADTO generate2FA(User2FAAuthenticationRequestDTO user2FAAuthenticationRequestDTO) throws CustomUserException, QrGenerationException {
        User user = userRepository.getUserByUsername(user2FAAuthenticationRequestDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        String secret;
        if (!user.isMfaEnabled()) {
            secret = twoFactorAuthenticationService.generateNewSecret();
            user.setSecret(secret);
            userRepository.save(user);
        }

        User2FADTO user2FADTO = new User2FADTO();

        user2FADTO.setQrCodeUri(twoFactorAuthenticationService.generateQrCodeImageUri(user.getSecret()));

        return user2FADTO;
    }

    @Override
    public void verifyCode(VerificationRequestDTO verificationRequestDTO) throws CustomUserException {
        User user = userRepository.getUserByUsername(verificationRequestDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }

        if (!twoFactorAuthenticationService.isOtpValid(user.getSecret(), verificationRequestDTO.getCode())) {
            throw new CustomUserException("The verification code is not correct!");
        }
        if (!user.isMfaEnabled()) {
            user.setMfaEnabled(true);
            userRepository.save(user);
        }
    }


    @Override
    public void sendMessageToEmail(String email) throws CustomUserException, MessagingException {
        User user = userRepository.getUserByEmail(email);
        if (user == null) {
            throw new CustomUserException("There is no user connected with this email!");
        }
        user.setIsPasswordChangeEnabled(true);
        userRepository.save(user);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setSubject("Change your password!");
        helper.setTo(email);
        helper.setText("""
                You have requested to change your password in FMI DeskSpot!\s
                \s
                 In order to chnage your password click the link below:
                \s
                \s
                 http://localhost:5173/change-password""");
        javaMailSender.send(message);
    }

    @Override
    public void sendOneTimePassCode(OneTimePassCodeRequestDTO oneTimePassCodeRequestDTO) throws CustomUserException, MessagingException {
        User user = userRepository.getUserByEmail(oneTimePassCodeRequestDTO.getEmail());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        OneTimePassCodeWrapper oneTimePassCodeWrapper = twoFactorAuthenticationService.createOneTimePassword();

        user.setOnePassCode(String.valueOf(oneTimePassCodeWrapper.getCode()));
        userRepository.save(user);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setSubject("Login with one time pass code!");
        helper.setTo(oneTimePassCodeRequestDTO.getEmail());
        helper.setText("You have requested to login in your account in FMI DeskSpot via one time pass code! \n \n In order to login into your account enter the passcode below:" +
                "\n \n \n " + oneTimePassCodeWrapper.getCode() + " \n \n expiration time: 2 minutes");
        javaMailSender.send(message);
    }

    @Override
    public void verifyOnePassCode(OneTimePassVerificationDTO oneTimePassVerificationDTO) throws CustomUserException {
        User user = userRepository.getUserByUsername(oneTimePassVerificationDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }

        if (!twoFactorAuthenticationService.isOneTimePassValid(user.getOnePassCode(), oneTimePassVerificationDTO.getCode())) {
            throw new CustomUserException("The verification code is not correct!");
        }
    }

    @Override
    public EnableOneTimePassResponseDTO enableOrDisableOneTimePass(EnableOneTimePassDTO enableOneTimePassDTO) throws CustomUserException {
        User user = userRepository.getUserByUsername(enableOneTimePassDTO.getUsername());

        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        EnableOneTimePassResponseDTO enableOneTimePassResponseDTO = new EnableOneTimePassResponseDTO();
        enableOneTimePassResponseDTO.setEnabled(!user.isOneTimePassEnabled());
        user.setOneTimePassEnabled(!user.isOneTimePassEnabled());
        userRepository.save(user);
        return enableOneTimePassResponseDTO;
    }

    @Override
    public EnableTwoFactorAuthenticationResponseDTO enableOrDisableTwoFactorAuthentication(EnableTwoFactorAuthenticationDTO enableTwoFactorAuthenticationDTO) throws CustomUserException {
        User user = userRepository.getUserByUsername(enableTwoFactorAuthenticationDTO.getUsername());

        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        EnableTwoFactorAuthenticationResponseDTO enableTwoFactorAuthenticationResponseDTO = new EnableTwoFactorAuthenticationResponseDTO();
        enableTwoFactorAuthenticationResponseDTO.setEnabled(enableTwoFactorAuthenticationDTO.isEnabled());
        user.setMfaEnabled(enableTwoFactorAuthenticationDTO.isEnabled());
        userRepository.save(user);
        return enableTwoFactorAuthenticationResponseDTO;
    }

    @Override
    public void addLinkToPage(AddLinkToPageDTO addLinkToPageDTO) throws CustomUserException {
        User user = userRepository.getUserByUsername(addLinkToPageDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        user.setLinkToPage(addLinks(user.getLinkToPage(), addLinkToPageDTO.getLinkToPage()));
        userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserByUsername(String username) throws CustomUserException {
        User user = userRepository.getUserByUsername(username);
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        return user;
    }

    @Override
    public List<User> searchUser(SearchGuestDTO searchGuestDTO) {
        List<User> newUserList = new ArrayList<>();
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            if (user.getUsername().toUpperCase().contains(searchGuestDTO.getUsername().toUpperCase())) {
                newUserList.add(user);
            }
        }
        return newUserList.stream().sorted(Comparator.comparing(User::getUsername)).collect(Collectors.toList());
    }

    @Override
    public void changeLanguage(ChangeUserLanguageDTO changeUserLanguageDTO) throws CustomUserException {
        User user = userRepository.getUserByUsername(changeUserLanguageDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        user.setLanguagePreferred(changeUserLanguageDTO.getLanguagePreferred());
        userRepository.save(user);
    }

    @Override
    public void updatePassword(String password) throws CustomUserException {
        List<User> users = userRepository.findAll();
        User newUser = new User();
        boolean userFound = false;
        for (User user : users) {
            if (user.getIsPasswordChangeEnabled() != null && user.getIsPasswordChangeEnabled()) {
                newUser = user;
                userFound = true;
                break;
            }
        }

        if (!userFound) {
            throw new CustomUserException("User with such email not found!");
        }

        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setIsPasswordChangeEnabled(false);
        userRepository.save(newUser);
    }

    private List<LinkToPage> addLinks(List<LinkToPage> userLinks, List<String> linkToPageDTOS) {
        List<String> newUserLinks = new ArrayList<>();
        for (LinkToPage linkToPage : userLinks) {
            newUserLinks.add(linkToPage.getLinkToPage());
        }
        for (String link : linkToPageDTOS) {
            if (!newUserLinks.contains(link)) {
                userLinks.add(LinkToPage.builder().linkToPage(link).build());
            }
        }
        return userLinks;
    }

    private List<Event> addEvent(User user, List<Event> eventList, Event event) {

        if (eventList.isEmpty()) {
            eventList.add(event);
            if (event.getUsers().isEmpty()) {
                event.setUsers(new ArrayList<>());
            }
            event.getUsers().add(user);
            eventRepository.save(event);
            return eventList;
        }
        boolean checkIfContainsEvent = false;
        for (Event userEvent : eventList) {
            if (userEvent.getName().equals(event.getName())) {
                checkIfContainsEvent = true;
                break;
            }
        }
        if (!checkIfContainsEvent) {
            eventList.add(event);
            if (event.getUsers().isEmpty()) {
                event.setUsers(new ArrayList<>());
            }
            event.getUsers().add(user);
            eventRepository.save(event);
        }
        return eventList;
    }

    private boolean checkIfUserCanReserveSeat(UserReserveSpotDTO userReserveSpotDTO) {
        List<Seat> seats = seatRepository.findAll();
        for (Seat seat : seats) {
            if (userReserveSpotDTO.getFacultyName().equals(seat.getEvent().getFacultyName()) &&
                    userReserveSpotDTO.getFloorNumber() == seat.getEvent().getFloorNumber() &&
                    userReserveSpotDTO.getRoomNumber() == seat.getEvent().getRoomNumber() &&
                    userReserveSpotDTO.getEventName().equals(seat.getEvent().getName()) &&
                    seat.getUserThatOccupiedSeat().equals(userReserveSpotDTO.getUsername())) {
                return false;
            }
        }
        return true;
    }
}
