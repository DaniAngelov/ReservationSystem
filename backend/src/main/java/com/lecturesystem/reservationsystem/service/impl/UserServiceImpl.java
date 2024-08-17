package com.lecturesystem.reservationsystem.service.impl;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.UserDTO;
import com.lecturesystem.reservationsystem.model.dto.UserLoginDTO;
import com.lecturesystem.reservationsystem.model.dto.UserReserveSpotDTO;
import com.lecturesystem.reservationsystem.model.entity.Event;
import com.lecturesystem.reservationsystem.model.entity.Seat;
import com.lecturesystem.reservationsystem.model.entity.User;
import com.lecturesystem.reservationsystem.repository.EventRepository;
import com.lecturesystem.reservationsystem.repository.SeatRepository;
import com.lecturesystem.reservationsystem.repository.UserRepository;
import com.lecturesystem.reservationsystem.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;

    private final EventRepository eventRepository;

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

        Seat chosenSeat = userReserveSpotDTO.getSeat();
        boolean seatFound = false;
        for(Seat seat: event.getSeats()){
            if(seat.getSeatNumber().equals(chosenSeat.getSeatNumber())){
                chosenSeat = seat;
                seatFound = true;
                break;
            }
        }
        if(!seatFound){
            throw new CustomUserException("There is no such seat!");
        }
        if (!checkIfUserCanReserveSeat(user, chosenSeat)) {
            throw new CustomUserException("You have already reserved seat in this room!");
        }
        if (chosenSeat.isSeatTaken()) {
            throw new CustomUserException("Seat is already taken by another user!");
        }
        chosenSeat.setSeatTaken(true);
        chosenSeat.setUserThatOccupiedSeat(user.getUsername());
        user.getSeats().add(seatRepository.save(chosenSeat));
        user.setEvents(addEvent(user.getEvents(), event));
        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);
    }

    private List<Event> addEvent(List<Event> eventList, Event event) {
        if (eventList.isEmpty()) {
            eventList.add(event);
            return eventList;
        }
        boolean checkIfContainsEvent = false;
        for (Event userEvent : eventList) {
            if (Objects.equals(userEvent.getId(), event.getId())) {
                checkIfContainsEvent = true;
                break;
            }
        }
        if (!checkIfContainsEvent) {
            eventList.add(event);
        }
        return eventList;
    }

    private boolean checkIfUserCanReserveSeat(User user, Seat newSeat) {
        for (Seat seat : user.getSeats()) {

            if (seat.getEvent() != null && newSeat.getEvent().getRoom().getRoomNumber() == seat.getEvent().getRoom().getRoomNumber()) {
                return false;
            }
        }
        return true;
    }
}
