package com.lecturesystem.reservationsystem.service.impl;

import com.lecturesystem.reservationsystem.model.dto.AddRoomImageDTO;
import com.lecturesystem.reservationsystem.model.dto.FacultyDTO;
import com.lecturesystem.reservationsystem.model.dto.FloorDTO;
import com.lecturesystem.reservationsystem.model.dto.RoomDTO;
import com.lecturesystem.reservationsystem.model.entity.Faculty;
import com.lecturesystem.reservationsystem.model.entity.Floor;
import com.lecturesystem.reservationsystem.model.entity.Room;
import com.lecturesystem.reservationsystem.repository.FacultyRepository;
import com.lecturesystem.reservationsystem.repository.FloorRepository;
import com.lecturesystem.reservationsystem.repository.RoomRepository;
import com.lecturesystem.reservationsystem.service.FacultyAndFloorService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FacultyAndFloorServiceImpl implements FacultyAndFloorService {
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;

    private final FacultyRepository facultyRepository;

    @Override
    public void addFaculty(FacultyDTO facultyDTO) throws SQLException {
        Faculty facultyByName = facultyRepository.findFacultyByName(facultyDTO.getName());
        Faculty faculty = new Faculty();
        List<Floor> newFloors = new ArrayList<>();
        List<FloorDTO> floorDTOs = facultyDTO.getFloors();
        if (facultyByName == null) {
            faculty.setName(facultyDTO.getName());
            faculty.setFloors(addFloor(facultyDTO, newFloors, floorDTOs));
            facultyRepository.save(faculty);
            return;
        }
        newFloors = facultyByName.getFloors();

        faculty.setFloors(addFloor(facultyDTO, newFloors, floorDTOs));
        facultyRepository.save(faculty);
    }

    @Override
    public void addRoomImage(AddRoomImageDTO addRoomImageDTO) throws SQLException {
        List<Room> rooms = roomRepository.findAll();
        for (Room room : rooms) {
            if (room.getRoomNumber() == addRoomImageDTO.getRoomNumber() &&
                    room.getFacultyName().equals(addRoomImageDTO.getFacultyName()) &&
                    room.getFloorNumber().equals(addRoomImageDTO.getFloorNumber())) {
                room.setRoomImage(new SerialBlob(addRoomImageDTO.getRoomImage().getBytes()));
                roomRepository.save(room);
                break;
            }
        }
    }

    @Override
    public List<Faculty> getAllFloors() {
        return sortValues(facultyRepository.findAll());
    }

    private List<Floor> addFloor(FacultyDTO facultyDTO, List<Floor> newFloors, List<FloorDTO> floorDTOs) throws SQLException {
        for (FloorDTO floorDTO : floorDTOs) {
            boolean floorFound = false;
            for (Floor floor : newFloors) {
                if (floor.getFloorNumber().equals(floorDTO.getFloorNumber())) {
                    floor.setRooms(getRooms(facultyDTO, floorDTO, floorDTO.getRooms(), floor.getRooms()));
                    newFloors.add(floorRepository.save(floor));
                    floorFound = true;
                    break;
                }
            }
            if (!floorFound) {
                Floor floor = new Floor();
                floor.setFloorNumber(floorDTO.getFloorNumber());
                floor.setRooms(getRooms(facultyDTO, floorDTO, floorDTO.getRooms(), new ArrayList<>()));
                newFloors.add(this.floorRepository.save(floor));
            }
        }

        return newFloors.stream()
                .sorted(Comparator.comparing(Floor::getFloorNumber))
                .collect(Collectors.toList());
    }

    private List<Faculty> sortValues(List<Faculty> facultyList) {
        List<Faculty> newFaculties = new ArrayList<>();
        for (Faculty faculty : facultyList) {
            Faculty newFaculty = new Faculty();
            newFaculty.setFloors(faculty.getFloors().stream().sorted(Comparator.comparing(Floor::getFloorNumber)).collect(Collectors.toList()));
            newFaculty.setName(faculty.getName());
            newFaculties.add(newFaculty);
        }
        return newFaculties
                .stream()
                .sorted(Comparator.comparing(Faculty::getName))
                .collect(Collectors.toList());
    }

    private List<Room> getRooms(FacultyDTO faculty, FloorDTO floor, List<RoomDTO> roomDTOS, List<Room> rooms) throws SQLException {
        for (RoomDTO roomDTO : roomDTOS) {
            boolean roomFound = false;
            for (Room room : rooms) {
                if (room.getRoomNumber() == roomDTO.getRoomNumber()) {
                    room.setEvents(new ArrayList<>());
                    room.setSeatsNumber(roomDTO.getSeatsNumber());
                    room.setFloorNumber(floor.getFloorNumber());
                    room.setFacultyName(faculty.getName());
                    if (roomDTO.getRoomImage() != null) {
                        room.setRoomImage(new SerialBlob(roomDTO.getRoomImage().getBytes()));
                    }
                    roomRepository.save(room);
                    roomFound = true;
                    break;
                }
            }
            if (!roomFound) {
                Room newRoom = new Room();
                newRoom.setRoomNumber(roomDTO.getRoomNumber());
                newRoom.setSeatsNumber(roomDTO.getSeatsNumber());
                newRoom.setFloorNumber(floor.getFloorNumber());
                newRoom.setFacultyName(faculty.getName());
                newRoom.setEvents(new ArrayList<>());
                newRoom.setRoomType(roomDTO.getRoomType());
                if (roomDTO.getRoomImage() != null) {
                    newRoom.setRoomImage(new SerialBlob(roomDTO.getRoomImage().getBytes()));
                }
                rooms.add(roomRepository.save(newRoom));
            }
        }
        return rooms.stream()
                .sorted(Comparator.comparing(Room::getRoomNumber))
                .collect(Collectors.toList());
    }
}
