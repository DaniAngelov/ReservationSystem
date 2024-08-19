package com.lecturesystem.reservationsystem.service.impl;

import com.lecturesystem.reservationsystem.model.dto.FloorDTO;
import com.lecturesystem.reservationsystem.model.dto.RoomDTO;
import com.lecturesystem.reservationsystem.model.entity.Floor;
import com.lecturesystem.reservationsystem.model.entity.Room;
import com.lecturesystem.reservationsystem.repository.FloorRepository;
import com.lecturesystem.reservationsystem.repository.RoomRepository;
import com.lecturesystem.reservationsystem.service.FloorService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FloorServiceImpl implements FloorService {
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;

    @Override
    public Floor addFloor(FloorDTO floorDTO) {
        Floor floorByFloorNumber = floorRepository.getFloorByFloorNumber(floorDTO.getFloorNumber());
        if (floorByFloorNumber != null) {
            floorByFloorNumber.setRooms(getRooms(floorDTO.getRooms(), floorByFloorNumber.getRooms()));
            return floorRepository.save(floorByFloorNumber);
        }
        Floor floor = new Floor();
        floor.setFloorNumber(floorDTO.getFloorNumber());
        floor.setRooms(getRooms(floorDTO.getRooms(), new ArrayList<>()));
        return this.floorRepository.save(floor);
    }

    @Override
    public List<Floor> getAllFloors() {
        return sortValues(floorRepository.findAll());
    }

    private List<Floor> sortValues(List<Floor> floorList) {
        return floorList
                .stream()
                .sorted(Comparator.comparing(Floor::getFloorNumber))
                .collect(Collectors.toList());
    }

    private List<Room> getRooms(List<RoomDTO> roomDTOS, List<Room> rooms) {
        for (RoomDTO roomDTO : roomDTOS) {
            boolean roomFound = false;
            for (Room room : rooms) {
                if (room.getRoomNumber() == roomDTO.getRoomNumber()) {
                    room.setEvents(new ArrayList<>());
                    roomRepository.save(room);
                    roomFound = true;
                    break;
                }
            }
            if (!roomFound) {
                Room newRoom = new Room();
                newRoom.setRoomNumber(roomDTO.getRoomNumber());
                newRoom.setEvents(new ArrayList<>());
                newRoom.setRoomType(roomDTO.getRoomType());
                rooms.add(roomRepository.save(newRoom));
            }
        }
        return rooms.stream()
                .sorted(Comparator.comparing(Room::getRoomNumber))
                .collect(Collectors.toList());
    }
}
