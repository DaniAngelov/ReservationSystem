package com.lecturesystem.reservationsystem.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity(name = "floors")
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "floor_id", referencedColumnName = "id")
    private List<Room> rooms;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;
}
