package com.lecturesystem.reservationsystem.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.DeleteEventDTO;
import com.lecturesystem.reservationsystem.model.dto.EventDTO;
import com.lecturesystem.reservationsystem.model.dto.FloorDTO;
import com.lecturesystem.reservationsystem.model.dto.WrapperDTO;
import com.lecturesystem.reservationsystem.model.entity.Event;
import com.lecturesystem.reservationsystem.model.entity.Floor;
import com.lecturesystem.reservationsystem.service.EventService;
import com.lecturesystem.reservationsystem.service.FloorService;
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

    private final FloorService floorService;

    private final EventService eventService;

    private final ModelMapper modelMapper = new ModelMapper();

    private final ObjectMapper objectMapper = new ObjectMapper();


    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<FloorDTO> addFloor(@RequestBody FloorDTO floorDTO) throws CustomUserException {
        Floor floor = floorService.addFloor(floorDTO);
        return new ResponseEntity<>(modelMapper.map(floor, FloorDTO.class), HttpStatus.CREATED);
    }

    @PostMapping("/events")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'ADMIN')")
    public ResponseEntity<EventDTO> addEvent(@RequestBody EventDTO EventDTO) throws CustomEventException {
        Event event = eventService.addEvent(EventDTO);
        return new ResponseEntity<>(modelMapper.map(event, EventDTO.class), HttpStatus.CREATED);
    }

    @DeleteMapping("/events")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'ADMIN')")
    public ResponseEntity<?> deleteEvent(@RequestBody DeleteEventDTO deleteEventDTO) throws CustomEventException {
        eventService.deleteEvent(deleteEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/events")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN')")
    public ResponseEntity<List<EventDTO>> getAllEventsSorted(@RequestParam String sortField) {
        List<Event> events = eventService.getAllEvents(sortField);
        List<EventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, EventDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(eventDTOS, HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('USER', 'LECTOR','ADMIN')")
    public ResponseEntity<List<FloorDTO>> getAllFloorsWithDetailsSorted() {
        List<Floor> floors = floorService.getAllFloors();
        List<FloorDTO> floorDTOS = floors.stream().map(floor -> modelMapper.map(floor, FloorDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(floorDTOS, HttpStatus.OK);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<WrapperDTO> readDataFromFile(@ModelAttribute MultipartFile file) throws IOException, CustomUserException, CustomEventException {
        objectMapper.registerModule(new JavaTimeModule());
        System.out.println(file);
        WrapperDTO wrapperDTO = objectMapper.readValue(file.getInputStream(), WrapperDTO.class);
        for (FloorDTO floorDTO : wrapperDTO.getFloors()) {
            addFloor(floorDTO);
        }
        for (EventDTO eventDTO : wrapperDTO.getEvents()) {
            addEvent(eventDTO);
        }
        return new ResponseEntity<>(wrapperDTO, HttpStatus.CREATED);
    }


}
