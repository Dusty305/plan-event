package com.example.planevent.service;

import com.example.planevent.dto.EventDTO;
import com.example.planevent.dto.TaskDTO;
import com.example.planevent.entity.Event;
import com.example.planevent.entity.Task;

import java.util.List;

public interface EventsService {
    List<Event> getAllEventsByUsername(String username);

    List<Event> getAllYearEventsByUsername(String username, int year);

    List<Event> getAllMonthEventsByUsername(String username, int year, int month);

    List<Event> getAllWeekEventsByUsername(String username, int year, int month, int week);

    boolean updateEventByUsername(Event event, String username);

    boolean updateTaskByEvent(Task task, Event event);

    boolean saveEventByUsername(EventDTO eventDTO, String username);

    boolean saveTaskByEvent(TaskDTO taskDTO);
}
