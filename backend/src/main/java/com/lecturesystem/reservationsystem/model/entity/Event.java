package com.lecturesystem.reservationsystem.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity(name = "events")
@NoArgsConstructor
@Getter
@Setter
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private String description;

    @Column
    private int floorNumber;

    @Column
    private User organizer;

    @Column
    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @Column
    private LocalDateTime date;

    @OneToOne(cascade = CascadeType.ALL)
    private Duration duration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public String getEventType() {
        return eventType.toString();
    }
}
