package com.lecturesystem.reservationsystem.controller;


import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lecturesystem.reservationsystem.exception.CustomEventException;
import com.lecturesystem.reservationsystem.exception.CustomUserException;
import com.lecturesystem.reservationsystem.model.dto.*;
import com.lecturesystem.reservationsystem.model.dto.event.*;
import com.lecturesystem.reservationsystem.model.dto.export.ExportFacultyDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserDeleteEventDTO;
import com.lecturesystem.reservationsystem.model.entity.*;
import com.lecturesystem.reservationsystem.model.util.FacultyWrapper;
import com.lecturesystem.reservationsystem.repository.FacultyRepository;
import com.lecturesystem.reservationsystem.repository.UserRepository;
import com.lecturesystem.reservationsystem.service.EventService;
import com.lecturesystem.reservationsystem.service.FacultyAndFloorService;
import com.lecturesystem.reservationsystem.service.UserService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@CrossOrigin("*")
@RestController
@RequestMapping("api/floors")
@AllArgsConstructor
public class DeskSpotController {

    private final FacultyAndFloorService facultyAndFloorService;

    private final UserRepository userRepository;

    private final EventService eventService;

    private final ModelMapper modelMapper = new ModelMapper();

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final FacultyRepository facultyRepository;

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public void addFaculty(@RequestBody FacultyDTO facultyDTO) throws CustomUserException, SQLException {
        facultyAndFloorService.addFaculty(facultyDTO);
        new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/events")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'ADMIN')")
    public ResponseEntity<AddEventDTO> addEvent(@RequestBody EventDTO eventDTO) throws CustomEventException, IOException, SQLException, CustomUserException {
        Event event = eventService.addEvent(eventDTO);
        return new ResponseEntity<>(modelMapper.map(event, AddEventDTO.class), HttpStatus.CREATED);
    }

    @PostMapping("/events/add-mystery-event")
    public ResponseEntity<AddEventDTO> addMysteryEvent(@RequestParam Integer gameId, @RequestParam String username, @RequestParam Integer mysteryIndex, @RequestParam Integer answer, @RequestBody EventDTO eventDTO) throws CustomEventException, IOException, SQLException, CustomUserException {
//        Event event = eventService.addMysteryEvent(app,gameId,username,mysteryIndex);
        Event event = new Event();
        return new ResponseEntity<>(HttpStatus.CREATED);
    } //TODO DELETE THIS AFTER TEST

    @PutMapping("/events/search")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<List<AddEventDTO>> searchEvent(@RequestBody SearchEventDTO searchEventDTO) throws CustomUserException, SQLException, IOException {
        List<Event> events = eventService.searchEvents(searchEventDTO);
        List<AddEventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, AddEventDTO.class)).collect(toList());
        List<AddEventDTO> serializerEventDTOS = serializeEventDTOS(eventDTOS, events);
        addLinksForEvent(serializerEventDTOS);
        return new ResponseEntity<>(eventDTOS, HttpStatus.OK);
    }

    @PutMapping("/events/search-by-name")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<List<AddEventDTO>> searchEventByName(@RequestBody SearchEventByNameDTO searchEventByNameDTO) throws CustomEventException, CustomUserException, SQLException, IOException {
        List<Event> events = eventService.searchEventByName(searchEventByNameDTO);
        List<AddEventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, AddEventDTO.class)).collect(toList());
        List<AddEventDTO> serializerEventDTOS = serializeEventDTOS(eventDTOS, events);
        addLinksForEvent(serializerEventDTOS);
        return new ResponseEntity<>(eventDTOS, HttpStatus.OK);
    }

    @PutMapping("/events/delete-inactive-event")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<?> deleteEvent(@RequestBody DeleteEventDTO deleteEventDTO) throws CustomEventException {
        eventService.deleteEvent(deleteEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/events/user")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<?> deleteEventForUser(@RequestBody UserDeleteEventDTO userDeleteEventDTO) throws CustomEventException, CustomUserException {
        eventService.deleteEventForUser(userDeleteEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/events/disable")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'ADMIN')")
    public ResponseEntity<?> disableEvent(@RequestBody DisableEventDTO disableEventDTO) throws CustomEventException {
        eventService.disableEvent(disableEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/events")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<List<AddEventDTO>> getAllEventsSorted(@RequestParam String sortField) throws SQLException, IOException, CustomUserException {
        List<Event> events = eventService.getAllEvents(sortField);
        List<AddEventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, AddEventDTO.class)).collect(Collectors.toList());
        List<AddEventDTO> serializerEventDTOS = serializeEventDTOS(eventDTOS, events);
        addLinksForEvent(serializerEventDTOS);
        return new ResponseEntity<>(serializerEventDTOS, HttpStatus.OK);
    }

    @GetMapping("/events/get-event")
    @PreAuthorize("hasAnyAuthority('LECTOR', 'ADMIN')")
    public ResponseEntity<AddEventDTO> getSpecificEvent(@RequestParam String eventName) throws CustomEventException {
        Event event = eventService.getSpecificEventByName(eventName);
        AddEventDTO eventDTO = modelMapper.map(event, AddEventDTO.class);
        return new ResponseEntity<>(eventDTO, HttpStatus.OK);
    }

    @GetMapping("/events/user")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<List<AddEventDTO>> getAllEventsSortedForUser(@RequestParam String username) throws CustomUserException, SQLException, IOException {
        List<Event> events = eventService.getAllEventsForUser(username);
        List<AddEventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, AddEventDTO.class)).collect(Collectors.toList());
        List<AddEventDTO> serializerEventDTOS = serializeEventDTOS(eventDTOS, events);
        addLinksForEvent(serializerEventDTOS);
        return new ResponseEntity<>(serializerEventDTOS, HttpStatus.OK);
    }

    @GetMapping("/events/organizer")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<List<AddEventDTO>> getAllEventsSortedForOrganizer(@RequestParam String organizer) throws CustomUserException {
        List<Event> events = eventService.getAllEventsForOrganizer(organizer);
        List<AddEventDTO> eventDTOS = events.stream().map(event -> modelMapper.map(event, AddEventDTO.class)).collect(Collectors.toList());
        addLinksForEvent(eventDTOS);
        return new ResponseEntity<>(eventDTOS, HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<List<FacultyDTO>> getAllFloorsWithDetailsSorted() throws SQLException, IOException {
        List<Faculty> faculties = facultyAndFloorService.getAllFloors();
        List<FacultyDTO> facultyDTOS = faculties.stream().map(faculty -> modelMapper.map(faculty, FacultyDTO.class)).collect(Collectors.toList());
        serializeFacultyDTOS(facultyDTOS, faculties);
        return new ResponseEntity<>(facultyDTOS, HttpStatus.OK);
    }

    @PutMapping("/events/feedback")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<?> addFeedback(@RequestBody AddFeedbackFormDTO addFeedbackFormDTO) throws CustomEventException, CustomUserException {
        eventService.addFeedback(addFeedbackFormDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/events/event-end")
    @PreAuthorize("hasAnyAuthority('USER','LECTOR', 'ADMIN', 'DEVELOPER', 'QA', 'DEVOPS')")
    public ResponseEntity<?> endAnEvent(@RequestBody EndEventDTO endEventDTO) throws CustomEventException {
        eventService.endEvent(endEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/events/events-exist")
    public ResponseEntity<Boolean> checkEventExists() {
        boolean result = facultyAndFloorService.checkEventExist();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/events/add-room-image")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<?> addRoomImage(@RequestBody AddRoomImageDTO addRoomImageDTO) throws SQLException {
        facultyAndFloorService.addRoomImage(addRoomImageDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<WrapperDTO> readDataFromFile(@ModelAttribute MultipartFile file) throws IOException, CustomUserException, CustomEventException, SQLException {
        objectMapper.registerModule(new JavaTimeModule());
        WrapperDTO wrapperDTO = objectMapper.readValue(file.getInputStream(), WrapperDTO.class);
        for (FacultyDTO facultyDTO : wrapperDTO.getFaculties()) {
            addFaculty(facultyDTO);
        }
        for (EventDTO eventDTO : wrapperDTO.getEvents()) {
            addEvent(eventDTO);
        }
        return new ResponseEntity<>(wrapperDTO, HttpStatus.CREATED);
    }

    @GetMapping("/team-member-data")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<TeamMemberDTO>> getTeamMembersData() throws CustomUserException {
        return new ResponseEntity<>(eventService.getTeamMembersInfo(), HttpStatus.OK);
    }

    @PostMapping("/upload-start-data")
    public ResponseEntity<List<FacultyDTO>> uploadStartData() throws IOException, CustomUserException, CustomEventException, SQLException {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data.json");
        String name = "data.json";
        String originalFileName = "data.json";
        String contentType = "application/json";
        byte[] content = null;
        try {
            content = inputStream.readAllBytes();
        } catch (final IOException e) {
            System.err.println("error reading file: " + name);
            System.err.println(e);
        }
        if (facultyRepository.findAll().isEmpty()) {
            readDataFromFile(new MockMultipartFile(name,
                    originalFileName, contentType, content));
        }

        return getAllFloorsWithDetailsSorted();
    }

    @GetMapping(value = "/export", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ByteArrayResource> exportData() throws IOException {
        objectMapper.registerModule(new JavaTimeModule());
        List<ExportFacultyDTO> exportFacultyDTO = facultyAndFloorService.getWrapperDTO();
        ObjectWriter writer = objectMapper.writer(new DefaultPrettyPrinter());
        File newFile = new File(System.getProperty("java.io.tmpdir") + "testExportData.json");
        writer.writeValue(newFile, exportFacultyDTO);
        ContentDisposition contentDisposition = ContentDisposition.builder("attachment")
                .filename(newFile.getName())
                .build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(contentDisposition);
        Path path = Paths.get(newFile.getPath());
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(newFile.length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }

    private void addLinksForEvent(List<AddEventDTO> addEventDTOS) throws CustomUserException {
        for (AddEventDTO addEventDTO : addEventDTOS) {
            User organizer = userRepository.getUserByUsername(addEventDTO.getOrganizer());
            if (organizer == null) {
                throw new CustomUserException("There is no such user!");
            }
            addEventDTO.setLinkToPage(new ArrayList<>());
            for (LinkToPage linkToPage : organizer.getLinkToPage()) {
                addEventDTO.getLinkToPage().add(linkToPage.getLinkToPage());
            }
        }
    }

    private List<AddEventDTO> serializeEventDTOS(List<AddEventDTO> eventDTOS, List<Event> events) throws SQLException, IOException {
        List<AddEventDTO> serializedEvents = new ArrayList<>();
        for (AddEventDTO eventDTO : eventDTOS) {
            for (Event event : events) {
                if (eventDTO.getName().equals(event.getName())) {
                    if (event.getQrCodeQuestions() != null) {
                        eventDTO.setQrCodeQuestions(new String(event.getQrCodeQuestions().getBinaryStream().readAllBytes()));
                    }
                }
            }
            serializedEvents.add(eventDTO);
        }
        return serializedEvents;
    }

    private void serializeFacultyDTOS(List<FacultyDTO> facultyDTOS, List<Faculty> faculties) throws SQLException, IOException {
        List<FacultyWrapper> wrapperList = new ArrayList<>();

        for (Faculty faculty : faculties) {
            for (Floor floor : faculty.getFloors()) {
                for (Room room : floor.getRooms()) {
                    if (room.getRoomImage() != null) {
                        wrapperList.add(new FacultyWrapper(faculty.getName(), room, floor.getFloorNumber()));
                    }
                }
            }
        }
        for (FacultyWrapper facultyWrapper : wrapperList) {
            for (FacultyDTO facultyDTO : facultyDTOS) {
                for (FloorDTO floorDTO : facultyDTO.getFloors()) {
                    for (RoomDTO roomDTO : floorDTO.getRooms()) {
                        if (facultyWrapper.getFacultyName().equals(facultyDTO.getName()) &&
                                facultyWrapper.getFloorNumber().equals(floorDTO.getFloorNumber()) &&
                                facultyWrapper.getRoom().getRoomNumber() == roomDTO.getRoomNumber()) {
                            roomDTO.setRoomImage(new String(facultyWrapper.getRoom().getRoomImage().getBinaryStream().readAllBytes()));
                        }
                    }
                }
            }
        }
    }

}
