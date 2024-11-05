package com.lecturesystem.reservationsystem.model.dto.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserPointsDTO {
    private String username;
    private String languagePreferred;
    private String theme;
    private String password;
    private String email;
    private Integer points;
}
