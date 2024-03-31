package com.example.planevent.controller.dto;

import lombok.Getter;
import org.locationtech.jts.geom.Point;

@Getter
public class PointDTO {
    private final Double latitude;
    private final Double longitude;
    public PointDTO(Point point) {
        this.latitude = point.getY();
        this.longitude = point.getX();
    }

    public PointDTO() {
        this.latitude = null;
        this.longitude = null;
    }
}
