package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.AddFeedbackFormDTO;
import com.lecturesystem.reservationsystem.model.dto.TeamMemberDTO;
import com.lecturesystem.reservationsystem.model.dto.event.*;
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

    void addFeedback(AddFeedbackFormDTO addFeedbackFormDTO) throws CustomEventException, CustomUserException;

    void endEvent(EndEventDTO endEventDTO) throws CustomEventException;

    Event getSpecificEventByName(String eventName) throws CustomEventException;

    List<Event> searchEventByName(SearchEventByNameDTO addEventByNameDTO) throws CustomEventException;

    List<TeamMemberDTO> getTeamMembersInfo() throws CustomUserException;

}
