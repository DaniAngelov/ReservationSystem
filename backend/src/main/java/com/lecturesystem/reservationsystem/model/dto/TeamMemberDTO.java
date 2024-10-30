package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.dto.event.EventTeamMemberDTO;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class TeamMemberDTO {
    private String username;
    private List<SeatDTO> seatsReserved;
    private String role;
    private List<EventTeamMemberDTO> eventsReserved;
}
