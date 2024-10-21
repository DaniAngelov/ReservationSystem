package com.lecturesystem.reservationsystem.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "teams")
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;
}
