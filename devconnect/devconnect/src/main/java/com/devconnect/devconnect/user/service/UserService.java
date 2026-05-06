package com.devconnect.devconnect.user.service;

import java.util.List;

import com.devconnect.devconnect.security.JwtUtil;
import com.devconnect.devconnect.user.model.User;
import com.devconnect.devconnect.user.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
@Data
@Service
public class UserService {
    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public String login(String email, String password) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (encoder.matches(password, user.getPassword())) {
            return jwtUtil.generateToken(email);
        } else {
            throw new RuntimeException("Invalid password");
        }
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User getUserById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
