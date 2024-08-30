package com.lecturesystem.reservationsystem.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity(name = "seats")
@NoArgsConstructor
@Getter
@Setter
public class Seat implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_number")
    private String seatNumber;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "seat_taken")
    private boolean seatTaken;

    @Column(name = "user_that_occupied_seat")
    private String userThatOccupiedSeat;

    @Column(name = "occupied_computer")
    private boolean occupiesComputer;

    @Column(name = "occupied_charger")
    private boolean occupiesCharger;
}
