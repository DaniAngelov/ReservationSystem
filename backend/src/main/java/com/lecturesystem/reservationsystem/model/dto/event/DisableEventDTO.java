package com.lecturesystem.reservationsystem.model.dto.event;

import com.lecturesystem.reservationsystem.model.enums.DisableEventReason;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DisableEventDTO {
    private String name;
    private String user;
    private DisableEventReason disableReason;
    private String disableEventDescription;
}
