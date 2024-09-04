package com.lecturesystem.reservationsystem.model.entity;

import com.lecturesystem.reservationsystem.model.enums.DisableEventReason;
import com.lecturesystem.reservationsystem.model.enums.Duration;
import com.lecturesystem.reservationsystem.model.enums.EventType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Blob;
import java.util.List;

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
    private String linkToOrganizerPage;

//    @Column
//    private FeedbackForm feedbackForm;

    @Column
    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @OneToOne(cascade = CascadeType.ALL)
    private Duration duration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private List<Seat> seats;

    @Column
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private List<Guest> guests;

    @ManyToMany(mappedBy = "events")
    private List<User> users;

    @Column
    private String organizer;

    @Column
    private int roomNumber;

    @Column
    private String facultyName;

    @Column
    private boolean enabled;

    @Column
    @Lob
    private Blob qrCodeQuestions;

    @Column
    @Enumerated(EnumType.STRING)
    private DisableEventReason disableEventReason;

    public String getEventType() {
        return eventType.toString();
    }
}
