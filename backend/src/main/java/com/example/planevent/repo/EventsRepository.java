package com.example.planevent.repo;

import com.example.planevent.entity.Event;
import com.example.planevent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface EventsRepository extends JpaRepository<Event, Long> {
    //List<Event> findAllByUserAndStartBetween(User user, Date start, Date end);
    List<Event> findAllByUserAndStartBetween(User user, Date start, Date end);
    List<Event> findAllByUser(User user);
}
