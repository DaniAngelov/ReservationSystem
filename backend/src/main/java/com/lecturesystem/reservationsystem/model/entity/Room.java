package com.lecturesystem.reservationsystem.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity(name = "rooms")
@NoArgsConstructor
@Getter
@Setter
public class Room {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number")
    private int roomNumber;

    @ManyToOne
    @JoinColumn(name = "floor_id")
    private Floor floor;

    @Column
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private List<Seat> seats;

    @Column
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private List<Event> events;
}
