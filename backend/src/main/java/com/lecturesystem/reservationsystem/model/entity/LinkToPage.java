package com.lecturesystem.reservationsystem.model.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity(name = "link_to_page")
@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class LinkToPage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String linkToPage;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
