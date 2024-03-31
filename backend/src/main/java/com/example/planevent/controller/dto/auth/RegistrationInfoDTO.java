package com.example.planevent.controller.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegistrationInfoDTO {
    private final String firstName;
    private final String lastName;
    private final String username;
    private final String email;
    private final String password;
}
