package com.lecturesystem.reservationsystem.model.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "guests")
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String username;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Column
    private String seatNumber;
}
