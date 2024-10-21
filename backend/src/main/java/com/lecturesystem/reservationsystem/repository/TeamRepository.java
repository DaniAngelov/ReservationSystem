package com.lecturesystem.reservationsystem.repository;

import com.lecturesystem.reservationsystem.model.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Team findTeamByName(String name);
}
