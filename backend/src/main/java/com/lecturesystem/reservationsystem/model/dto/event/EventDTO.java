package com.lecturesystem.reservationsystem.model.dto.event;

import com.lecturesystem.reservationsystem.model.dto.DurationDTO;
import com.lecturesystem.reservationsystem.model.dto.FeedbackFormDTO;
import com.lecturesystem.reservationsystem.model.dto.SeatDTO;
import com.lecturesystem.reservationsystem.model.dto.users.GetUserDTO;
import com.lecturesystem.reservationsystem.model.dto.users.GuestDTO;
import com.lecturesystem.reservationsystem.model.enums.DisableEventReason;
import com.lecturesystem.reservationsystem.model.enums.EventType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
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
    private String organizer;
    private String qrCodeQuestions;
    private List<String> linkToPage;
    private List<GuestDTO> guests;
    private List<GetUserDTO> users;
    private List<SeatDTO> seats;
    private List<EventDTO> events;
    private boolean hasEnded;
    private List<FeedbackFormDTO> feedbackForm;
    private String disableEventDescription;
}
