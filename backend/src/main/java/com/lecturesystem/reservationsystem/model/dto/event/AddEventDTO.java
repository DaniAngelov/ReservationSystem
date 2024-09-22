package com.lecturesystem.reservationsystem.model.dto.event;

import com.lecturesystem.reservationsystem.model.dto.DurationDTO;
import com.lecturesystem.reservationsystem.model.dto.FeedbackFormDTO;
import com.lecturesystem.reservationsystem.model.dto.SeatDTO;
import com.lecturesystem.reservationsystem.model.dto.users.GuestDTO;
import com.lecturesystem.reservationsystem.model.dto.users.UserDTO;
import com.lecturesystem.reservationsystem.model.enums.DisableEventReason;
import com.lecturesystem.reservationsystem.model.enums.EventType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AddEventDTO {
    private String name;
    private String description;
    private EventType eventType;
    private DurationDTO duration;
    private boolean enabled;
    private DisableEventReason disableEventReason;
    private int roomNumber;
    private int floorNumber;
    private String organizer;
    private String facultyName;
    private UserDTO user;
    private List<SeatDTO> seats;
    private String qrCodeQuestions;
    private List<String> linkToPage;
    private List<GuestDTO> guests;
    private boolean hasEnded;
    private List<FeedbackFormDTO> feedbackForm;
    private String disableEventDescription;
}
