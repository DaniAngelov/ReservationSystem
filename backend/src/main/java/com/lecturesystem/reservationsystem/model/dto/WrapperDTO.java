package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.dto.event.EventDTO;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WrapperDTO implements Serializable {
    List<FacultyDTO> faculties;
    List<EventDTO> events;
}
