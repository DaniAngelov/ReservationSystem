package com.lecturesystem.reservationsystem.controller;


import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.EventDTO;
import com.lecturesystem.reservationsystem.model.dto.FloorDTO;
import com.lecturesystem.reservationsystem.model.entity.Event;
import com.lecturesystem.reservationsystem.model.entity.Floor;
import com.lecturesystem.reservationsystem.service.EventService;
import com.lecturesystem.reservationsystem.service.FloorService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @PostMapping
    public ResponseEntity<FloorDTO> addFloor(@RequestBody FloorDTO floorDTO) throws CustomUserException {
        Floor floor = floorService.addFloor(floorDTO);
        return new ResponseEntity<>(modelMapper.map(floor, FloorDTO.class), HttpStatus.CREATED);
    }

    @PostMapping("/events")
    public ResponseEntity<EventDTO> addEvent(@RequestBody EventDTO EventDTO) throws CustomEventException {
        Event event = eventService.addEvent(EventDTO);
        return new ResponseEntity<>(modelMapper.map(event, EventDTO.class), HttpStatus.CREATED);
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventDTO>> getAllEventsSorted(@RequestParam String sortField) {
        List<Event> events = eventService.getAllEvents(sortField);
        List<EventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, EventDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(eventDTOS, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<FloorDTO>> getAllFloorsWithDetailsSorted() {
        List<Floor> floors = floorService.getAllFloors();
        List<FloorDTO> floorDTOS = floors.stream().map(floor -> modelMapper.map(floor, FloorDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(floorDTOS, HttpStatus.OK);
    }
}
