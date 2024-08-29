package com.lecturesystem.reservationsystem.repository;

import com.lecturesystem.reservationsystem.model.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Faculty findFacultyByName(String name);
}
