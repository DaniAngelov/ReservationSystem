package com.lecturesystem.reservationsystem.service.impl;

import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.model.dto.DurationDTO;
import com.lecturesystem.reservationsystem.model.dto.EventDTO;
import com.lecturesystem.reservationsystem.model.entity.Duration;
import com.lecturesystem.reservationsystem.model.entity.Event;
import com.lecturesystem.reservationsystem.model.entity.Floor;
import com.lecturesystem.reservationsystem.model.entity.Room;
import com.lecturesystem.reservationsystem.repository.EventRepository;
import com.lecturesystem.reservationsystem.repository.FloorRepository;
import com.lecturesystem.reservationsystem.repository.RoomRepository;
import com.lecturesystem.reservationsystem.service.EventService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    private final RoomRepository roomRepository;

    private final FloorRepository floorRepository;

    @Override
    public Event addEvent(EventDTO eventDTO) throws CustomEventException {
        Event eventByName = eventRepository.findEventByName(eventDTO.getName());
        if (eventByName != null) {
            throw new CustomEventException("There is such event already!");
        }
        Floor floor = floorRepository.getFloorByFloorNumber(eventDTO.getFloorNumber());
        if (floor == null) {
            throw new CustomEventException("There is no such floor!");
        }

        for (Room room : floor.getRooms()) {
            if (room.getRoomNumber() == eventDTO.getRoomNumber()) {
                Event event = new Event();
                event.setName(eventDTO.getName());
                event.setDate(eventDTO.getDate());
                event.setDescription(eventDTO.getDescription());
                event.setEventType(eventDTO.getEventType());
                event.setDuration(getDuration(eventDTO.getDuration()));
                event.setRoom(room);
                event.setFloorNumber(eventDTO.getFloorNumber());
                Event eventResult = this.eventRepository.save(event);
                room.getEvents().add(eventResult);
                this.roomRepository.save(room);
                return eventResult;
            }
        }
        throw new CustomEventException("There is no such room!");
    }

    @Override
    public List<Event> getAllEvents(String sortField) {
        return sortValues(eventRepository.findAll(), sortField);
    }

    private List<Event> sortValues(List<Event> eventList, String sortField) {
        Comparator<Event> comparing = Comparator.comparing(Event::getName);
        switch (sortField) {
            case "name" -> comparing = Comparator.comparing(Event::getName);
            case "eventType" -> comparing = Comparator.comparing(Event::getEventType);
            case "date" -> comparing = Comparator.comparing(Event::getDate);
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
        duration.setStartDate(durationDTO.getStartDate());
        duration.setEndDate(durationDTO.getEndDate());
        return duration;
    }
}