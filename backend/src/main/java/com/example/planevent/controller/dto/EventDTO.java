package com.example.planevent.controller.dto;

import com.example.planevent.entity.Event;
import com.example.planevent.entity.Location;
import com.example.planevent.entity.Task;
import com.example.planevent.entity.User;
import lombok.Data;
import lombok.Getter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
public class EventDTO {
    private Long id;

    private String name;

    private String description;

    private Date start;

    private Date end;

    private Location location;

    private String color;

    public EventDTO(Event event) {
        this.id = event.getId();
        this.name = event.getName();
        this.description = event.getDescription();
        this.start = event.getStart();
        this.end = event.getEnd();
        this.location = event.getLocation();
        this.color = event.getColor();
    }

    public EventDTO() {
        this.id = null;
        this.name = null;
        this.description = null;
        this.start = null;
        this.end = null;
        this.location = null;
        this.color = null;
    }
}
