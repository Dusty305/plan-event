package com.example.planevent.service;

import com.example.planevent.entity.User;
import org.springframework.security.core.Authentication;

import javax.persistence.EntityNotFoundException;

public interface UserService {
    User getUserByUsername(String username);

    void registerUser(User user);

    Authentication authorizeUser(User user);

    String generateAuthenticationToken(Authentication authentication);
}
