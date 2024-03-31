package com.example.planevent.controller;

import com.example.planevent.controller.dto.EventDTO;
import com.example.planevent.controller.dto.PointDTO;
import com.example.planevent.controller.dto.TaskDTO;
import com.example.planevent.entity.Event;
import com.example.planevent.entity.Task;
import com.example.planevent.entity.User;
import com.example.planevent.mapper.EventMapper;
import com.example.planevent.mapper.TaskMapper;
import com.example.planevent.service.EventsService;
import com.example.planevent.service.UserService;
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

    @Autowired
    private UserService userService;

    @Autowired
    private EventMapper eventMapper;

    @Autowired
    private TaskMapper taskMapper;

    @GetMapping
    public List<EventDTO> getAllEvents(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        List<Event> events = eventsService.getAllEventsByUser(user);
        return eventMapper.eventsToEventDtos(events);
    }

    @PostMapping("/update_event")
    public ResponseEntity<?> updateEvent(@AuthenticationPrincipal UserDetails userDetails,
                                         @RequestBody EventDTO eventDTO) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        Event event = convertToEvent(eventDTO);
        if(eventsService.updateEventByUser(event, user))
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
        User user = userService.getUserByUsername(userDetails.getUsername());
        Event event = eventMapper.eventDTOtoEvent(eventDTO);
        if(eventsService.saveEventByUser(event, user))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

    @PostMapping("/save_task")
    public ResponseEntity<?> saveTask(@AuthenticationPrincipal UserDetails userDetails,
                                       @RequestBody TaskDTO taskDTO) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        Task task = taskMapper.taskDtoToTask(taskDTO);
        if(eventsService.saveTaskByUser(task, user))
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
