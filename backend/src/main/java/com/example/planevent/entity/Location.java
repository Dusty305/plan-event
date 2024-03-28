package com.example.planevent.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "locations")
@Data
public class Location {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String address;

    @Column(nullable=false)
    private Double latitude;

    @Column(nullable=false)
    private Double longitude;
}
