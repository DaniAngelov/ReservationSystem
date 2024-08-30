package com.lecturesystem.reservationsystem.model.dto.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class OneTimePassCodeWrapper {
    private Date expirationDate;
    private Integer code;
}
