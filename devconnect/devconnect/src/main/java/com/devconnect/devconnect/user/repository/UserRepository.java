package com.devconnect.devconnect.user.repository;

import com.devconnect.devconnect.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface UserRepository extends JpaRepository <User, Long> {
    Optional<User> findByEmail(String email);
}
