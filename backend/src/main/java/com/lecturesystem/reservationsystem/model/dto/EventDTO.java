package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.enums.EventType;
import com.lecturesystem.reservationsystem.model.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class EventDTO {
    private String name;
    private String description;
    private User organizer;
    private EventType eventType;
    private DurationDTO duration;
    private int roomNumber;
    private int floorNumber;
    private List<User> users;
    private List<SeatDTO> seats;
}
