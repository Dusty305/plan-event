package com.example.planevent.mapper;

import com.example.planevent.controller.dto.TaskDTO;
import com.example.planevent.entity.Task;
import org.mapstruct.Mapper;

@Mapper
public interface TaskMapper {
    Task taskDtoToTask(TaskDTO taskDTO);
}
