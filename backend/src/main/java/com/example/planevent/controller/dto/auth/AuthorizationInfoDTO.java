package com.example.planevent.controller.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthorizationInfoDTO {
    private final String username;
    private final String password;
}
