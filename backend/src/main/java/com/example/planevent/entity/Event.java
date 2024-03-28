package com.example.planevent.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.locationtech.jts.geom.Point;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "events")
@Data
public class Event {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "start_date", nullable = false)
    private Date start;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "end_date", nullable = false)
    private Date end;

    @ManyToOne(cascade = CascadeType.ALL)
    private Location location;

    @Column
    private String color;

    @ManyToOne
    //@Column(name = "user_id", nullable = false)
    private User user;

    // todo: maybe should have "mappedBy" event_id, may cause errors later
    @OneToMany(mappedBy = "event")
    private List<Task> tasks;
}
