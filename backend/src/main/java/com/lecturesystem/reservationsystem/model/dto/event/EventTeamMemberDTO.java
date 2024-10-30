package com.lecturesystem.reservationsystem.model.dto.event;

import com.lecturesystem.reservationsystem.model.enums.EventType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventTeamMemberDTO {
    private String name;
    private EventType eventType;
    private int roomNumber;
    private int floorNumber;
    private String organizer;
    private String facultyName;
}
