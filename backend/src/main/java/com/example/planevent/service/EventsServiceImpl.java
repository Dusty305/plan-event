package com.example.planevent.service;

import com.example.planevent.dto.EventDTO;
import com.example.planevent.dto.PointDTO;
import com.example.planevent.dto.TaskDTO;
import com.example.planevent.entity.Event;
import com.example.planevent.entity.Task;
import com.example.planevent.entity.User;
import com.example.planevent.repo.EventsRepository;
import com.example.planevent.repo.TaskRepository;
import com.example.planevent.repo.UserRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class EventsServiceImpl implements EventsService {
    @Autowired
    private EventsRepository eventsRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public List<Event> getAllEventsByUsername(String username) {
        User user = userRepository.findByUsername(username).get();
        return eventsRepository.findAllByUser(user);
    }

    @Override
    public List<Event> getAllYearEventsByUsername(String username, int year) {
        User user = userRepository.findByUsername(username).get();

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR, year);

        calendar.set(Calendar.DAY_OF_YEAR, 1);
        Date startDate = calendar.getTime();

        calendar.set(Calendar.MONTH, 11);
        calendar.set(Calendar.DAY_OF_MONTH, 31);
        Date endDate = calendar.getTime();

        return eventsRepository.findAllByUserAndStartBetween(user, startDate, endDate);
    }

    @Override
    public List<Event> getAllMonthEventsByUsername(String username, int year, int month) {
        User user = userRepository.findByUsername(username).get();

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month);

        calendar.set(Calendar.DAY_OF_MONTH, 1); // todo: 0 ?
        Date startDate = calendar.getTime();

        calendar.set(Calendar.DAY_OF_MONTH, 31); // todo: February
        Date endDate = calendar.getTime();

        return eventsRepository.findAllByUserAndStartBetween(user, startDate, endDate);
    }

    @Override
    public List<Event> getAllWeekEventsByUsername(String username, int year, int month, int week) {
        User user = userRepository.findByUsername(username).get();

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.MONTH, month);
        calendar.set(Calendar.WEEK_OF_MONTH, week);

        calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY); // todo: 0 ?
        Date startDate = calendar.getTime();

        calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY); // todo: February
        Date endDate = calendar.getTime();

        return eventsRepository.findAllByUserAndStartBetween(user, startDate, endDate);
    }

    @Override
    public boolean updateEventByUsername(Event updatedEvent, String username) {
        Long updatedEventID = updatedEvent.getId();
        Event oldEvent = eventsRepository.findById(updatedEventID).orElse(null);
        if (oldEvent == null)
            return false;

        User user = userRepository.findByUsername(username).get();
        oldEvent.setUser(user);
        eventsRepository.save(updatedEvent);
        return true;
    }

    @Override
    public boolean updateTaskByEvent(Task task, Event event) {
        Long eventID = event.getId();
        Event oldEvent = eventsRepository.findById(eventID).orElse(null);
        if (oldEvent == null)
            return false;

        Long taskIndex = event.getTasks().stream().map(Task::getId).findFirst().orElse(null);
        if(taskIndex == null)
            return false;

        event.getTasks().set(Math.toIntExact(taskIndex), task);
        eventsRepository.save(event);
        return true;
    }

    @Override
    public boolean saveEventByUsername(EventDTO eventDTO, String username) {
        User user = userRepository.findByUsername(username).get();
        Event event = new Event();

        event.setName(eventDTO.getName());
        event.setDescription(eventDTO.getDescription());
        event.setColor(eventDTO.getColor());
        event.setStart(eventDTO.getStart());
        event.setEnd(eventDTO.getEnd());
        event.setUser(user);

        event.setLocation(eventDTO.getLocation());

        eventsRepository.save(event);
        return true;
    }

    @Override
    public boolean saveTaskByEvent(TaskDTO taskDTO) {
        Task task = new Task();

        Long eventId = taskDTO.getEventID();
        Event event = eventsRepository.findById(eventId).orElse(null);
        if (event == null)
            return false;

        task.setEvent(event);
        task.setName(taskDTO.getName());
        task.setDescription(taskDTO.getDescription());
        task.setDate(taskDTO.getDate());
        task.setLocation(taskDTO.getLocation());

        taskRepository.save(task);
        return true;
    }

    private Point pointDTOToPoint(PointDTO pointDTO) {
        Double longitude = pointDTO.getLongitude();
        Double latitude = pointDTO.getLatitude();
        Coordinate coordinate = new Coordinate(longitude, latitude);
        return geometryFactory.createPoint(coordinate);
    }
}
