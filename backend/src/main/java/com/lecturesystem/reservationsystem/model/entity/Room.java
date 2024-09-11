package com.lecturesystem.reservationsystem.model.entity;

import com.lecturesystem.reservationsystem.model.enums.RoomType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Entity(name = "rooms")
@NoArgsConstructor
@Getter
@Setter
public class Room implements Serializable {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number")
    private int roomNumber;

    @Column(name = "seats_number")
    private int seatsNumber;

    @ManyToOne
    @JoinColumn(name = "floor_id")
    private Floor floor;

    @Column
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private List<Event> events;

    @Column
    @Enumerated(EnumType.STRING)
    private RoomType roomType;
}
