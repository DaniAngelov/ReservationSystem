package com.lecturesystem.reservationsystem.model.entity;

import com.lecturesystem.reservationsystem.model.enums.RoomType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.sql.Blob;
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

    @Column(name = "developer_seats_number")
    private int developerSeatsNumber;

    @Column(name = "qa_seats_number")
    private int qaSeatsNumber;

    @Column(name = "devops_seats_number")
    private int devopsSeatsNumber;

    @ManyToOne
    @JoinColumn(name = "floor_id")
    private Floor floor;

    @Column
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private List<Event> events;

    @Column(name = "faculty_name")
    private String facultyName;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column
    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    @Column
    @Lob
    private Blob roomImage;
}
