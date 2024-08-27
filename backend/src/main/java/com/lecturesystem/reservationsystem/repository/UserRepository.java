package com.lecturesystem.reservationsystem.repository;

import com.lecturesystem.reservationsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User getUserById(Long id);

    User getUserByUsername(String username);

    User getUserByEmail(String email);
}
