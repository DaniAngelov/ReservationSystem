package com.lecturesystem.reservationsystem.model.dto;

import com.lecturesystem.reservationsystem.model.dto.event.EventDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WrapperDTO implements Serializable {
    List<FacultyDTO> faculties;
    List<EventDTO> events;
}
