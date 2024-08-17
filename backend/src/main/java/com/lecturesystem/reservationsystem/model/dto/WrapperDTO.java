package com.lecturesystem.reservationsystem.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class WrapperDTO implements Serializable {
    List<FloorDTO> floors;
    List<EventDTO> events;
}
