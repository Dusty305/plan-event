package com.example.planevent.service.exception;

import com.example.planevent.entity.User;
import lombok.Getter;

@Getter
public class UserAlreadyExistsException extends RuntimeException {
    private final User user;
    public UserAlreadyExistsException(String message, User user){
        super(message);
        this.user = user;
    }
}
