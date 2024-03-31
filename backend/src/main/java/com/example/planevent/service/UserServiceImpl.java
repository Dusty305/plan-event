package com.example.planevent.service;

import com.example.planevent.entity.User;
import com.example.planevent.repo.UserRepository;
import com.example.planevent.security.jwt.JwtUtils;
import com.example.planevent.service.exception.EntityNotFoundException;
import com.example.planevent.service.exception.UserAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;
    @Override
    public User getUserByUsername(String username) {
        try {
            return userRepository.findByUsername(username).get();
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Аккаунта с именем пользователя " + username + " не существует", e);
        }
    }

    @Override
    public void registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException(
                    "Аккаунт с почтой " + user.getEmail() + " уже зарегистрирован",
                    user
            );
        }
        else if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException(
                    "Аккаунт с именем пользователя " + user.getUsername() + " уже зарегистрирован",
                    user
            );
        }
        else {
            user.setPassword(encoder.encode(user.getPassword()));
            userRepository.save(user);
        }
    }

    @Override
    public Authentication authorizeUser(User user) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword())); // TODO: throws AuthenticationException
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return authentication;
    }

    @Override
    public String generateAuthenticationToken(Authentication authentication) {
        return jwtUtils.generateJwtToken(authentication);
    }
}
