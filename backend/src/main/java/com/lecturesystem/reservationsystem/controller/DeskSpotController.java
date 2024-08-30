package com.lecturesystem.reservationsystem.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.FacultyDTO;
import com.lecturesystem.reservationsystem.model.dto.WrapperDTO;
import com.lecturesystem.reservationsystem.model.dto.event.*;
import com.lecturesystem.reservationsystem.model.entity.Event;
import com.lecturesystem.reservationsystem.model.entity.Faculty;
import com.lecturesystem.reservationsystem.service.EventService;
import com.lecturesystem.reservationsystem.service.FacultyAndFloorService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("api/floors")
@AllArgsConstructor
public class DeskSpotController {

    private final FacultyAndFloorService facultyAndFloorService;

    private final EventService eventService;

    private final ModelMapper modelMapper = new ModelMapper();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addFaculty(@RequestBody FacultyDTO facultyDTO) throws CustomUserException {
        facultyAndFloorService.addFaculty(facultyDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/events")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'ADMIN')")
    public ResponseEntity<AddEventDTO> addEvent(@RequestBody EventDTO EventDTO) throws CustomEventException {
        Event event = eventService.addEvent(EventDTO);
        return new ResponseEntity<>(modelMapper.map(event, AddEventDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/events/search")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN')")
    public ResponseEntity<List<EventDTO>> searchEvent(@RequestBody SearchEventDTO searchEventDTO) {
        List<Event> events = eventService.searchEvents(searchEventDTO);
        List<EventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, EventDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(eventDTOS, HttpStatus.OK);
    }

    @DeleteMapping("/events")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'ADMIN')")
    public ResponseEntity<?> deleteEvent(@RequestBody DeleteEventDTO deleteEventDTO) throws CustomEventException {
        eventService.deleteEvent(deleteEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/events/disable")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'ADMIN')")
    public ResponseEntity<?> disableEvent(@RequestBody DisableEventDTO disableEventDTO) throws CustomEventException {
        eventService.disableEvent(disableEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/events")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN')")
    public ResponseEntity<List<AddEventDTO>> getAllEventsSorted(@RequestParam String sortField) {
        List<Event> events = eventService.getAllEvents(sortField);
        List<AddEventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, AddEventDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(eventDTOS, HttpStatus.OK);
    }

    @GetMapping("/events/user")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN')")
    public ResponseEntity<List<AddEventDTO>> getAllEventsSortedForUser(@RequestParam String username) throws CustomUserException {
        List<Event> events = eventService.getAllEventsForUser(username);
        List<AddEventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, AddEventDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(eventDTOS, HttpStatus.OK);
    }

    @GetMapping("/events/organizer")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'ADMIN')")
    public ResponseEntity<List<AddEventDTO>> getAllEventsSortedForOrganizer(@RequestParam String organizer) throws CustomUserException {
        List<Event> events = eventService.getAllEventsForOrganizer(organizer);
        List<AddEventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, AddEventDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(eventDTOS, HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('USER', 'LECTOR','ADMIN')")
    public ResponseEntity<List<FacultyDTO>> getAllFloorsWithDetailsSorted() {
        List<Faculty> faculties = facultyAndFloorService.getAllFloors();
        List<FacultyDTO> facultyDTOS = faculties.stream().map(faculty -> modelMapper.map(faculty, FacultyDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(facultyDTOS, HttpStatus.OK);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<WrapperDTO> readDataFromFile(@ModelAttribute MultipartFile file) throws IOException, CustomUserException, CustomEventException {
        objectMapper.registerModule(new JavaTimeModule());
        System.out.println(file);
        WrapperDTO wrapperDTO = objectMapper.readValue(file.getInputStream(), WrapperDTO.class);
        for (FacultyDTO facultyDTO : wrapperDTO.getFaculties()) {
            addFaculty(facultyDTO);
        }
        for (EventDTO eventDTO : wrapperDTO.getEvents()) {
            addEvent(eventDTO);
        }
        return new ResponseEntity<>(wrapperDTO, HttpStatus.CREATED);
    }
}
