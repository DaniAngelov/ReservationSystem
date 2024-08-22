package com.lecturesystem.reservationsystem.model.dto.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class User2FAAuthenticationRequestDTO {
    private String username;
    private boolean mfaEnabled;
}
