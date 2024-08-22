package com.lecturesystem.reservationsystem.model.enums;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    USER, LECTOR, ADMIN;

    @Override
    public String getAuthority() {
        return this.name();
    }
}
