package com.example.planevent.controller;

import com.example.planevent.dto.EventDTO;
import com.example.planevent.dto.PointDTO;
import com.example.planevent.dto.TaskDTO;
import com.example.planevent.entity.Event;
import com.example.planevent.entity.Task;
import com.example.planevent.service.EventsService;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventsController {
    @Autowired
    private EventsService eventsService;

    @GetMapping
    public List<EventDTO> getAllEvents(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        List<Event> events = eventsService.getAllEventsByUsername(username);
        return events.stream().map(EventDTO::new).collect(Collectors.toList());
    }

    @PostMapping("/update_event")
    public ResponseEntity<?> updateEvent(@AuthenticationPrincipal UserDetails userDetails,
                                         @RequestBody EventDTO eventDTO) {
        String username = userDetails.getUsername();
        Event event = convertToEvent(eventDTO);
        if(eventsService.updateEventByUsername(event, username))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @PostMapping("/update_task")
    public ResponseEntity<?> updateTask(@RequestBody Task task) {
        Event event = task.getEvent();
        if(eventsService.updateTaskByEvent(task, event))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @PostMapping("/save_event")
    public ResponseEntity<?> saveEvent(@AuthenticationPrincipal UserDetails userDetails,
                                       @RequestBody EventDTO eventDTO) {
        String username = userDetails.getUsername();
        if(eventsService.saveEventByUsername(eventDTO, username))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @PostMapping("/save_task")
    public ResponseEntity<?> saveTask(@AuthenticationPrincipal UserDetails userDetails,
                                       @RequestBody TaskDTO taskDTO) {
        if(eventsService.saveTaskByEvent(taskDTO))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

    private Event convertToEvent(EventDTO eventDTO) {
        Event event = new Event();
        event.setId(eventDTO.getId());
        event.setName(eventDTO.getName());
        event.setDescription(eventDTO.getDescription());
        event.setStart(eventDTO.getStart());
        event.setEnd(eventDTO.getEnd());
        event.setColor(eventDTO.getColor());
        event.setLocation(eventDTO.getLocation());
        return event;
    }

    private Point convertToPoint(PointDTO pointDTO) {
        Coordinate coordinate = new Coordinate();
        coordinate.x = pointDTO.getLongitude();
        coordinate.y = pointDTO.getLatitude();
        return new GeometryFactory().createPoint(coordinate);
    }
}
