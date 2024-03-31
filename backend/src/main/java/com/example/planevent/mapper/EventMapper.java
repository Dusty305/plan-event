package com.example.planevent.mapper;

import com.example.planevent.controller.dto.EventDTO;
import com.example.planevent.entity.Event;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface EventMapper {
    Event eventDTOtoEvent(EventDTO eventDTO);

    List<EventDTO> eventsToEventDtos(List<Event> events);
}
