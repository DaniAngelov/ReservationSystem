package com.lecturesystem.reservationsystem.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "feedback_forms")
@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class FeedbackForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String name;

    @Column
    private Integer lectureRating;

    @Column
    private Integer lectorRating;

    @Column
    private String description;

    @Column
    private boolean isAnonymous;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Column
    private String username;
}
