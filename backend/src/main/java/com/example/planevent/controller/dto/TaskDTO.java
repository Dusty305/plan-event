package com.example.planevent.controller.dto;

import com.example.planevent.entity.Event;
import com.example.planevent.entity.Location;
import lombok.Data;
import lombok.Getter;

import javax.persistence.*;
import java.util.Date;

@Getter
public class TaskDTO {
    private Long id;

    private String name;

    private String description;

    private Date date;

    private Location location;

    private Long eventID;
}
