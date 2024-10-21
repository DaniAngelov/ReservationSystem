package com.lecturesystem.reservationsystem.model.dto.export;

import com.lecturesystem.reservationsystem.model.enums.EventType;
import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ExportEventDTO {
    private String name;
    private EventType eventType;
    private boolean enabled;
    private String organizer;
    private int availableSeats;
    private boolean hasEnded;
}
