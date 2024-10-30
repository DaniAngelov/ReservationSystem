package com.lecturesystem.reservationsystem.model.dto.users;

import com.lecturesystem.reservationsystem.model.entity.Event;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UserDTO {
    private String username;
    private String password;
    private String email;
    private LocalDateTime lastActive;
    private List<Event> events;
    private Integer points;
    private String role;
    private String teamName;
}
