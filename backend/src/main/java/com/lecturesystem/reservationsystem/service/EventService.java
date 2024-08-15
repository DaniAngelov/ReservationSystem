package com.lecturesystem.reservationsystem.service;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.model.dto.EventDTO;
import com.lecturesystem.reservationsystem.model.entity.Event;

import java.util.List;

public interface EventService {
    Event addEvent(EventDTO eventDTO) throws CustomEventException;

    List<Event> getAllEvents(String sortField);
}
