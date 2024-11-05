package com.lecturesystem.reservationsystem.model.dto.users;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangeUserThemeDTO {
    private String username;
    private String theme;
}
