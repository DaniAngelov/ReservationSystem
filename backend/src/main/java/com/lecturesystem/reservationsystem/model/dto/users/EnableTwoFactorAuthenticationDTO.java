package com.lecturesystem.reservationsystem.model.dto.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EnableTwoFactorAuthenticationDTO {
    private String username;
    private boolean enabled;
}
