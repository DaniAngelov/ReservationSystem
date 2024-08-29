package com.lecturesystem.reservationsystem.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity(name = "faculties")
@NoArgsConstructor
@Getter
@Setter
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "faculty_name")
    private String name;

    @Column
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "faculty_id", referencedColumnName = "id")
    private List<Floor> floors;
}
