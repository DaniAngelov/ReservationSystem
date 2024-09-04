package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.event.DeleteEventDTO;
import com.lecturesystem.reservationsystem.model.dto.event.DisableEventDTO;
import com.lecturesystem.reservationsystem.model.dto.event.EventDTO;
import com.lecturesystem.reservationsystem.model.dto.event.SearchEventDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserDeleteEventDTO;
import com.lecturesystem.reservationsystem.model.entity.Event;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface EventService {
    Event addEvent(EventDTO eventDTO) throws CustomEventException, IOException, SQLException, CustomUserException;

    List<Event> getAllEvents(String sortField);

    List<Event> searchEvents(SearchEventDTO searchEventDTO);

    List<Event> getAllEventsForUser(String username) throws CustomUserException;

    List<Event> getAllEventsForOrganizer(String organizer) throws CustomUserException;

    void deleteEvent(DeleteEventDTO deleteEventDTO) throws CustomEventException;

    void disableEvent(DisableEventDTO disableEventDTO) throws CustomEventException;

    void deleteEventForUser(UserDeleteEventDTO userDeleteEventDTO) throws CustomUserException, CustomEventException;

}
