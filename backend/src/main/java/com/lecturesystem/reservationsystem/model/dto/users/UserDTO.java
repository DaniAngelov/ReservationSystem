package com.lecturesystem.reservationsystem.model.dto.users;

import com.lecturesystem.reservationsystem.model.entity.Event;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private String username;
    private String password;
    private String email;
    private LocalDateTime lastActive;
    private List<Event> events;
}
