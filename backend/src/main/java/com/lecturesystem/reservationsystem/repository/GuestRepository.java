package com.lecturesystem.reservationsystem.repository;

import com.lecturesystem.reservationsystem.model.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
}
