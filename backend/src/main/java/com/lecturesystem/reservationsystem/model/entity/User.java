package com.lecturesystem.reservationsystem.model.entity;


import com.lecturesystem.reservationsystem.model.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "users")
public class User implements Serializable, UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String username;

    @Column
    private String password;

    @Column(unique = true)
    private String email;

    @Column(name = "last_active")
    private LocalDateTime lastActive;

    @Column
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "User_Event",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "event_id")}
    )
    private List<Event> events;

    @Column
    private boolean mfaEnabled;

    @Column
    private boolean oneTimePassEnabled;

    @Column
    private String secret;

    @Column
    private String onePassCode;

    @Column
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column
    private Boolean isPasswordChangeEnabled;

    @Column
    private String linkToPage;

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
