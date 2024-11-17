package com.lecturesystem.reservationsystem.service.impl;

import com.lecturesystem.reservationsystem.config.JwtService;
import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.AuthenticationResponseDTO;
import com.lecturesystem.reservationsystem.model.dto.SeatDTO;
import com.lecturesystem.reservationsystem.model.dto.TeamDTO;
import com.lecturesystem.reservationsystem.model.dto.users.*;
import com.lecturesystem.reservationsystem.model.entity.*;
import com.lecturesystem.reservationsystem.model.enums.Role;
import com.lecturesystem.reservationsystem.model.enums.RoomType;
import com.lecturesystem.reservationsystem.model.enums.SeatType;
import com.lecturesystem.reservationsystem.repository.*;
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

    private final TeamRepository teamRepository;
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
        user.setEvents(new ArrayList<>());
        if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode("12345"));
        } else {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        if (userDto.getEmail() == null || userDto.getEmail().isEmpty()) {
            String randomString = String.valueOf(System.currentTimeMillis());
            user.setEmail(randomString.substring(5));
        } else {
            user.setEmail(userDto.getEmail());
        }
        user.setLanguagePreferred("ENG");
        user.setTheme("dark");
        if (userDto.getRole() == null) {
            userDto.setRole("USER");
        }
        switch (userDto.getRole()) {
            case "ADMIN" -> user.setRole(Role.ADMIN);
            case "QA" -> user.setRole(Role.QA);
            case "DEVELOPER" -> user.setRole(Role.DEVELOPER);
            case "DEVOPS" -> user.setRole(Role.DEVOPS);
            default -> user.setRole(Role.USER);
        }
        if (userDto.getTeamName() != null && !userDto.getTeamName().isEmpty()) {
            user.setTeamName(userDto.getTeamName());
        }
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
    public void registerAdmin(RegisterAdminDTO registerAdminDTO) throws CustomUserException {
        UserDTO.UserDTOBuilder adminBuilder = UserDTO.builder().username("admin").email("admin@abv.bg").role("ADMIN");
        if (registerAdminDTO.getPassword() != null) {
            adminBuilder.password(registerAdminDTO.getPassword());
        } else {
            adminBuilder.password("admin");
        }
        UserDTO admin = adminBuilder.build();
        registerUser(admin);
    }

    @Override
    public boolean getAdmin() {
        User user = userRepository.getUserByUsername("admin");
        return user != null;
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
            if (userReserveSpotDTO.isOccupiesComputer()) {
                chosenSeat.setOccupiesComputerNumber(userReserveSpotDTO.getOccupiesComputerNumber());
            }
            if (userReserveSpotDTO.isOccupiesCharger()) {
                chosenSeat.setOccupiesChargerNumber(userReserveSpotDTO.getOccupiesChargerNumber());
            }
        }
        chosenSeat.setSeatTaken(true);
        chosenSeat.setUserThatOccupiedSeat(user.getUsername());
        chosenSeat.setUserRole(user.getRole().toString());
        event.setAvailableSeats(event.getRoom().getSeatsNumber() - 1);
        seatRepository.save(chosenSeat);
        user.setEvents(addEvent(user, user.getEvents(), event));
        user.setLastActive(LocalDateTime.now());
        user.setPoints(user.getPoints() + 1);
        userRepository.save(user);
    }

    @Override
    public void reserveSpotTeam(TeamDTO teamDTO) throws CustomEventException, CustomUserException {
        Team foundTeam = teamRepository.findTeamByName(teamDTO.getName());
        if (foundTeam == null) {
            Team newTeam = Team.builder().name(teamDTO.getName()).build();
            teamRepository.save(newTeam);
        }

        Event event = eventRepository.findEventByName(teamDTO.getEventName());
        if (event == null) {
            throw new CustomEventException("There is no such event!");
        }
        Faculty faculty = facultyRepository.findFacultyByName(teamDTO.getFacultyName());
        if (faculty == null) {
            throw new CustomEventException("There is no such faculty!");
        }
        int seats = teamDTO.getSeats() == null ? 0 : teamDTO.getSeats();
        if (event.getAvailableSeats() < seats) {
            throw new CustomEventException("There are not enough seats available!");
        }
        int qaSeats = teamDTO.getQaSeats() == null ? 0 : teamDTO.getQaSeats();
        if (event.getAvailableQaSeats() < qaSeats) {
            throw new CustomEventException("There are not enough QA seats available!");
        }
        int developerSeats = teamDTO.getDeveloperSeats() == null ? 0 : teamDTO.getDeveloperSeats();
        if (event.getAvailableDeveloperSeats() < developerSeats) {
            throw new CustomEventException("There are not enough DEVELOPER seats available!");
        }
        int devopsSeats = teamDTO.getDevopsSeats() == null ? 0 : teamDTO.getDevopsSeats();
        if (event.getAvailableDevopsSeats() < devopsSeats) {
            throw new CustomEventException("There are not enough DEVOPS seats available!");
        }
        if (event.getRoom() == null) {
            throw new CustomUserException("There is no such room!");
        }
        List<UserDTO> registeredUsers = registerUsers(teamDTO.getUsers(), teamDTO.getName());
        List<UserDTO> normalUserDtos = registeredUsers.stream().filter((user) -> Role.valueOf(user.getRole()).equals(Role.USER)).toList();
        List<UserDTO> qaUserDtos = registeredUsers.stream().filter((user) -> Role.valueOf(user.getRole()).equals(Role.QA)).toList();
        List<UserDTO> developerUserDtos = registeredUsers.stream().filter((user) -> Role.valueOf(user.getRole()).equals(Role.DEVELOPER)).toList();
        List<UserDTO> devopsUserDtos = registeredUsers.stream().filter((user) -> Role.valueOf(user.getRole()).equals(Role.DEVOPS)).toList();
        saveSeatsStatus(teamDTO, event, seats, SeatType.NORMAL, normalUserDtos);
        saveSeatsStatus(teamDTO, event, qaSeats, SeatType.QA, qaUserDtos);
        saveSeatsStatus(teamDTO, event, developerSeats, SeatType.DEVELOPER, developerUserDtos);
        saveSeatsStatus(teamDTO, event, devopsSeats, SeatType.DEVOPS, devopsUserDtos);
        event.setAvailableSeats(event.getAvailableSeats() - seats);
        event.setAvailableQaSeats(event.getAvailableQaSeats() - qaSeats);
        event.setAvailableDeveloperSeats(event.getAvailableDeveloperSeats() - developerSeats);
        event.setAvailableDevopsSeats(event.getAvailableDevopsSeats() - devopsSeats);
        eventRepository.save(event);

    }

    private void saveSeatsStatus(TeamDTO teamDTO, Event event, int seats, SeatType seatType, List<UserDTO> users) {
        int seatsNumberCount = 0;
        for (int i = 0; i < event.getSeats().size(); i++) {
            Seat seat = event.getSeats().get(i);
            if (seatsNumberCount == seats) {
                break;
            }
            if (!seat.isSeatTaken() && seat.getSeatType().equals(seatType)) {
                if (event.getRoom().getRoomType().equals(RoomType.COMPUTER)) {
                    seat.setOccupiesComputer(teamDTO.isOccupiesComputer());
                    seat.setOccupiesCharger(teamDTO.isOccupiesCharger());
                    if (seat.isOccupiesComputer()) {
                        seat.setOccupiesComputerNumber(teamDTO.getOccupiesComputerNumber());
                    }
                    if (seat.isOccupiesCharger()) {
                        seat.setOccupiesChargerNumber(teamDTO.getOccupiesChargerNumber());
                    }
                }
                seat.setSeatTaken(true);
                User user = userRepository.getUserByUsername(users.get(seatsNumberCount).getUsername());
                user.setEvents(addEvent(user, user.getEvents(), event));
                user.setLastActive(LocalDateTime.now());
                user.setPoints(user.getPoints() + 1);
                user.setTemporaryUserExpirationDate(event.getDuration().getEndDate());
                userRepository.save(user);
                seat.setUserThatOccupiedSeat(user.getUsername());
                seat.setUserRole(user.getRole().toString());
                seatRepository.save(seat);
                seatsNumberCount++;
            }
        }
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
        chosenSeat.setUserRole(null);
        chosenSeat.setUserThatOccupiedSeat("");
        chosenSeat.setOccupiesChargerNumber(0);
        chosenSeat.setOccupiesComputerNumber(0);
        event.setAvailableSeats(event.getAvailableSeats() + 1);
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
    public Boolean checkPassword(String username) throws CustomUserException {
        User user = userRepository.getUserByUsername(username);
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        return passwordEncoder.matches("12345", user.getPassword());
    }

    @Override
    public User changeLanguage(ChangeUserLanguageDTO changeUserLanguageDTO) throws CustomUserException {
        User user = userRepository.getUserByUsername(changeUserLanguageDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        user.setLanguagePreferred(changeUserLanguageDTO.getLanguagePreferred());
        return userRepository.save(user);
    }

    @Override
    public void deleteInactiveUsers() {
        List<User> users = userRepository.findAll().stream().filter(user -> user.getTemporaryUserExpirationDate() != null && user.getTemporaryUserExpirationDate().isBefore(LocalDateTime.now())).toList();
        if (!users.isEmpty()) {
            for (User user : users) {
                List<Seat> seats = seatRepository.findAll();
                for (Seat seat : seats) {
                    Event seatEvent = seat.getEvent();
                    if (seat.getUserThatOccupiedSeat().equals(user.getUsername())) {
                        if (user.getRole().equals(Role.USER)) {
                            seatEvent.setAvailableSeats(seatEvent.getAvailableSeats() + 1);
                        } else if (user.getRole().equals(Role.DEVELOPER)) {
                            seatEvent.setAvailableDeveloperSeats(seatEvent.getAvailableDeveloperSeats() + 1);
                        } else if (user.getRole().equals(Role.QA)) {
                            seatEvent.setAvailableQaSeats(seatEvent.getAvailableQaSeats() + 1);
                        } else if (user.getRole().equals(Role.DEVOPS)) {
                            seatEvent.setAvailableDevopsSeats(seatEvent.getAvailableDevopsSeats() + 1);
                        }
                        seat.setUserRole(null);
                        seat.setSeatTaken(false);
                        seat.setUserThatOccupiedSeat("");
                        seat.setOccupiesChargerNumber(0);
                        seat.setOccupiesComputerNumber(0);
                        seat.setOccupiesComputer(false);
                        seat.setOccupiesCharger(false);
                    }
                }
                user.setEvents(null);
                userRepository.delete(user);
            }
        }
    }

    @Override
    public User changeTheme(ChangeUserThemeDTO changeUserThemeDTO) throws CustomUserException {
        User user = userRepository.getUserByUsername(changeUserThemeDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        user.setTheme(changeUserThemeDTO.getTheme());
        return userRepository.save(user);
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

    private List<UserDTO> registerUsers(List<UserDTO> userDTOS, String teamName) throws CustomUserException {
        List<UserDTO> newUserDtos = new ArrayList<>();
        for (UserDTO userDTO : userDTOS) {
            if (userDTO.getRole() == null) {
                userDTO.setRole("USER");
            }
            User userByUsername = userRepository.getUserByUsername(userDTO.getUsername());
            userDTO.setTeamName(teamName);
            if (userByUsername == null) {
                registerUser(userDTO);
            }
            newUserDtos.add(userDTO);
        }
        return newUserDtos;
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
