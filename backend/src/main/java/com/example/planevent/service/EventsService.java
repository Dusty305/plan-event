package com.example.planevent.service;

import com.example.planevent.entity.Event;
import com.example.planevent.entity.Task;
import com.example.planevent.entity.User;

import java.util.List;

public interface EventsService {
    List<Event> getAllEventsByUser(User user);

    List<Event> getAllYearEventsByUser(User user, int year);

    List<Event> getAllMonthEventsByUser(User user, int year, int month);

    List<Event> getAllWeekEventsByUser(User user, int year, int month, int week);

    boolean updateEventByUser(Event event, User user);

    boolean updateTaskByEventID(Task task, Long eventID);

    boolean saveEventByUser(Event event, User user);

    boolean saveTaskByEventID(Task task, Long eventID);
}
