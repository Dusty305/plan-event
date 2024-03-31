package com.example.planevent.controller;

import com.example.planevent.controller.dto.auth.AuthorizationInfoDTO;
import com.example.planevent.controller.dto.auth.RegistrationInfoDTO;
import com.example.planevent.entity.User;
import com.example.planevent.mapper.UserMapper;
import com.example.planevent.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @GetMapping("/test")
    public ResponseEntity<?> validateAuthentication() {
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/signin", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> authenticateUser(@RequestBody AuthorizationInfoDTO info) {
        User user = userMapper.toUser(info);
        Authentication authentication = userService.authorizeUser(user);
        String authenticationToken = userService.generateAuthenticationToken(authentication);
        return ResponseEntity.ok(authenticationToken);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationInfoDTO info) {
        User user = userMapper.toUser(info);
        userService.registerUser(user);
        return ResponseEntity.ok().build();
    }
}
