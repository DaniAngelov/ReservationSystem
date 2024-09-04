package com.lecturesystem.reservationsystem.service.impl;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.DurationDTO;
import com.lecturesystem.reservationsystem.model.dto.SeatDTO;
import com.lecturesystem.reservationsystem.model.dto.event.DeleteEventDTO;
import com.lecturesystem.reservationsystem.model.dto.event.DisableEventDTO;
import com.lecturesystem.reservationsystem.model.dto.event.EventDTO;
import com.lecturesystem.reservationsystem.model.dto.event.SearchEventDTO;
import com.lecturesystem.reservationsystem.model.dto.users.GuestDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserDeleteEventDTO;
import com.lecturesystem.reservationsystem.model.entity.*;
import com.lecturesystem.reservationsystem.model.enums.Duration;
import com.lecturesystem.reservationsystem.model.enums.SeatType;
import com.lecturesystem.reservationsystem.repository.*;
import com.lecturesystem.reservationsystem.service.EventService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    private final RoomRepository roomRepository;

    private final SeatRepository seatRepository;

    private final UserRepository userRepository;

    private final FacultyRepository facultyRepository;

    private final GuestRepository guestRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Override
    public Event addEvent(EventDTO eventDTO) throws CustomEventException, SQLException, CustomUserException {
        Event eventByName = eventRepository.findEventByName(eventDTO.getName());
        if (eventByName != null) {
            throw new CustomEventException("There is such event already!");
        }
        Faculty faculty = facultyRepository.findFacultyByName(eventDTO.getFacultyName());
        if (faculty == null) {
            throw new CustomEventException("There is no such faculty!");
        }
        User organizer = userRepository.getUserByUsername(eventDTO.getUser());
        if (organizer == null) {
            throw new CustomEventException("There is no such organizer!");
        }
        List<Floor> floors = faculty.getFloors();
        for (Floor floor : floors) {
            if (eventDTO.getFloorNumber() == floor.getFloorNumber()) {
                for (Room room : floor.getRooms()) {
                    if (room.getRoomNumber() == eventDTO.getRoomNumber()) {
                        Event event = new Event();
                        event.setName(eventDTO.getName());
                        event.setDescription(eventDTO.getDescription());
                        event.setEventType(eventDTO.getEventType());
                        event.setDuration(getDuration(eventDTO.getDuration()));
                        event.setSeats(getSeats(eventDTO.getSeats(), new ArrayList<>()));
                        event.setFloorNumber(eventDTO.getFloorNumber());
                        event.setRoomNumber(eventDTO.getRoomNumber());
                        event.setDisableEventReason(null);
                        event.setUsers(new ArrayList<>());
                        if (eventDTO.getQrCodeQuestions() != null) {
                            event.setQrCodeQuestions(new SerialBlob(eventDTO.getQrCodeQuestions().getBytes()));
                        }
                        event.setRoom(room);
                        addGuests(event, eventDTO);
                        event.setOrganizer(eventDTO.getUser());
                        addSeatForOrganizer(eventDTO.getUser(), event);
                        event.setEnabled(true);
                        event.setFacultyName(eventDTO.getFacultyName());
                        Event newEvent = this.eventRepository.save(event);
                        addEventsForGuests(eventDTO, newEvent);
                        room.getEvents().add(newEvent);
                        roomRepository.save(room);
                        return newEvent;
                    }
                }
                throw new CustomEventException("There is no such room!");
            }
        }
        throw new CustomEventException("There is no such floor!");
    }


    @Override
    public List<Event> getAllEvents(String sortField) {
        return sortValues(eventRepository.findAll(), sortField);
    }

    @Override
    public List<Event> searchEvents(SearchEventDTO searchEventDTO) {
        List<Event> foundEvents = new ArrayList<>();
        List<Event> events = eventRepository.findAll();
        for (Event event : events) {
            if (event.getFloorNumber() == searchEventDTO.getFloorNumber() &&
                    event.getRoomNumber() == searchEventDTO.getRoomNumber() &&
                    event.getFacultyName().equals(searchEventDTO.getFacultyName()) &&
                    event.getName().toUpperCase().contains(searchEventDTO.getSearchField().toUpperCase())) {
                foundEvents.add(event);
            }
        }
        return foundEvents.stream().sorted(Comparator.comparing(Event::getName)).collect(Collectors.toList());
    }

    @Override
    public List<Event> getAllEventsForUser(String username) throws CustomUserException {
        User user = userRepository.getUserByUsername(username);
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        return sortValues(user.getEvents(), "name");
    }

    @Override
    public List<Event> getAllEventsForOrganizer(String organizer) {
        List<Event> events = eventRepository.findAll();
        List<Event> organizerEvents = new ArrayList<>();
        for (Event event : events) {
            if (event.getOrganizer().equals(organizer)) {
                organizerEvents.add(event);
            }
        }
        return sortValues(organizerEvents, "name");
    }

    @Override
    public void deleteEvent(DeleteEventDTO deleteEventDTO) throws CustomEventException {
        Event event = eventRepository.findEventByName(deleteEventDTO.getName());
        if (event == null) {
            throw new CustomEventException("There is no such event!");
        }
        eventRepository.deleteById(event.getId());
    }

    @Override
    public void disableEvent(DisableEventDTO disableEventDTO) throws CustomEventException {
        User user = userRepository.getUserByUsername(disableEventDTO.getUser());
        if (user == null) {
            throw new CustomEventException("There is no such user!");
        }
        Event event = eventRepository.findEventByName(disableEventDTO.getName());
        if (event == null) {
            throw new CustomEventException("There is no such event!");
        }
        if (event.getOrganizer().equals(user.getUsername())) {
            event.setDisableEventReason(disableEventDTO.getDisableReason());
            event.setEnabled(false);
            eventRepository.save(event);
        }
    }

    @Override
    public void deleteEventForUser(UserDeleteEventDTO userDeleteEventDTO) throws CustomUserException, CustomEventException {
        User user = userRepository.getUserByUsername(userDeleteEventDTO.getUsername());
        if (user == null) {
            throw new CustomUserException("There is no such user!");
        }
        Event event = eventRepository.findEventByName(userDeleteEventDTO.getEventName());
        if (event == null) {
            throw new CustomEventException("There is no such event!");
        }
        User organizer = userRepository.getUserByUsername(userDeleteEventDTO.getUsername());
        if (organizer != null && userDeleteEventDTO.getUsername().equals(organizer.getUsername())) {
            event.setOrganizer("");
            event.setLinkToOrganizerPage("");
            eventRepository.save(event);
        }
        user.getEvents().removeIf(userEvent -> userEvent.getName().equals(event.getName()));
        userRepository.save(user);
    }

    private void addSeatForOrganizer(String user, Event event) {
        User organizer = userRepository.getUserByUsername(user);
        if (organizer != null) {
            Seat seat = new Seat();
            seat.setSeatType(SeatType.LECTOR);
            seat.setSeatTaken(true);
            seat.setUserThatOccupiedSeat(organizer.getUsername());
            seat.setSeatNumber("L1");
            event.getSeats().add(seatRepository.save(seat));
        }
    }

    private void addEventsForGuests(EventDTO eventDTO, Event event) throws CustomUserException {
        if (eventDTO.getGuests() != null) {
            for (GuestDTO guestDTO : eventDTO.getGuests()) {
                User user = userRepository.getUserByUsername(guestDTO.getUsername());
                if (user == null) {
                    throw new CustomUserException("There is no such user!");
                }
                user.getEvents().add(event);
                userRepository.save(user);
            }
        }
    }

    private void addGuests(Event event, EventDTO eventDTO) {
        if (eventDTO.getGuests() != null) {
            if (event.getGuests() == null) {
                event.setGuests(new ArrayList<>());
                int counter = 1;
                for (GuestDTO guestDTO : eventDTO.getGuests()) {
                    Guest guest = new Guest();
                    guest.setUsername(guestDTO.getUsername());
                    event.getGuests().add(guest);
                    Seat seat = new Seat();
                    seat.setSeatType(SeatType.GUEST);
                    seat.setSeatTaken(true);
                    seat.setUserThatOccupiedSeat(guest.getUsername());
                    seat.setSeatNumber("G" + counter);
                    event.getSeats().add(seatRepository.save(seat));
                    guest.setSeatNumber(seat.getSeatNumber());
                    guestRepository.save(guest);
                    counter++;
                }
            } else {
                int counter = 1;
                for (GuestDTO guestDTO : eventDTO.getGuests()) {

                    boolean guestFound = false;
                    for (Guest guest : event.getGuests()) {
                        if (guest.getUsername().equals(guestDTO.getUsername())) {
                            guestFound = true;
                            break;
                        }
                    }
                    if (!guestFound) {
                        Guest guest = new Guest();
                        guest.setUsername(guestDTO.getUsername());
                        event.getGuests().add(guest);
                        Seat seat = new Seat();
                        seat.setSeatType(SeatType.GUEST);
                        seat.setSeatTaken(true);
                        seat.setUserThatOccupiedSeat(guest.getUsername());
                        seat.setSeatNumber("G" + counter);
                        event.getSeats().add(seatRepository.save(seat));
                        guest.setSeatNumber(seat.getSeatNumber());
                        guestRepository.save(guest);
                        counter++;
                    }

                }
            }
        }
    }

    private List<Event> sortValues(List<Event> eventList, String sortField) {
        Comparator<Event> comparing = Comparator.comparing(Event::getName);
        switch (sortField) {
            case "name" -> comparing = Comparator.comparing(Event::getName);
            case "eventType" -> comparing = Comparator.comparing(Event::getEventType);
            case "duration" ->
                    comparing = Comparator.comparing(Event::getDuration, Comparator.comparing(Duration::getStartDate));
        }

        return eventList
                .stream()
                .sorted(comparing)
                .collect(Collectors.toList());
    }

    private Duration getDuration(DurationDTO durationDTO) {
        Duration duration = new Duration();

        LocalDateTime startDate = LocalDateTime.parse(durationDTO.getStartDate().replace('T', ' '), formatter);
        LocalDateTime endDate = LocalDateTime.parse(durationDTO.getEndDate().replace('T', ' '), formatter);
        duration.setStartDate(startDate);
        duration.setEndDate(endDate);
        return duration;
    }

    private List<Seat> getSeats(List<SeatDTO> seatDTOS, List<Seat> seats) {
        for (SeatDTO seatDTO : seatDTOS) {
            boolean seatFound = false;
            for (Seat seat : seats) {
                if (seat.getSeatNumber().equals(seatDTO.getSeatNumber())) {
                    seatFound = true;
                    break;
                }
            }
            if (!seatFound) {
                Seat newSeat = new Seat();
                newSeat.setSeatNumber(seatDTO.getSeatNumber());
                newSeat.setSeatTaken(false);
                if (seatDTO.getSeatType() != null) {
                    newSeat.setSeatType(seatDTO.getSeatType());
                } else {
                    newSeat.setSeatType(SeatType.NORMAL);
                }
                newSeat.setUserThatOccupiedSeat("");
                seats.add(seatRepository.save(newSeat));
            }
        }
        return seats.stream()
                .sorted(Comparator.comparing(Seat::getSeatNumber))
                .collect(Collectors.toList());
    }
}