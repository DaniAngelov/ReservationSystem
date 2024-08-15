package com.lecturesystem.reservationsystem.repository;

import com.lecturesystem.reservationsystem.model.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Long> {
    Floor getFloorByFloorNumber(Integer floorNumber);
}
