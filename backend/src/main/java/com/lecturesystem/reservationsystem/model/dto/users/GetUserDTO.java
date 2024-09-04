package com.lecturesystem.reservationsystem.model.dto.users;

import com.lecturesystem.reservationsystem.model.enums.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GetUserDTO {
    private String username;
    private Role role;
}
