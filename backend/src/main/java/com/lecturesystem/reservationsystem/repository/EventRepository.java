package com.lecturesystem.reservationsystem.repository;

import com.lecturesystem.reservationsystem.model.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>{
    Event findEventByName(String name);
}
