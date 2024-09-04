package com.lecturesystem.reservationsystem.model.dto.event;

import com.lecturesystem.reservationsystem.model.dto.DurationDTO;
import com.lecturesystem.reservationsystem.model.dto.SeatDTO;
import com.lecturesystem.reservationsystem.model.dto.users.GuestDTO;
import com.lecturesystem.reservationsystem.model.enums.DisableEventReason;
import com.lecturesystem.reservationsystem.model.enums.EventType;
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
    private EventType eventType;
    private boolean enabled;
    private DisableEventReason disableEventReason;
    private DurationDTO duration;
    private int roomNumber;
    private int floorNumber;
    private String facultyName;
    private String user;
    private List<SeatDTO> seats;
    private String organizer;
    private String qrCodeQuestions;
    private List<GuestDTO> guests;
}
