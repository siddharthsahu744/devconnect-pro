package com.devconnect.devconnect.user.controller;

import com.devconnect.devconnect.user.dto.AuthRequest;
import com.devconnect.devconnect.user.dto.AuthResponse;
import com.devconnect.devconnect.user.model.User;
import com.devconnect.devconnect.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService service;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String token = service.login(request.getEmail(), request.getPassword());
        return new AuthResponse(token);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return service.getUserById(id);
    }
}
