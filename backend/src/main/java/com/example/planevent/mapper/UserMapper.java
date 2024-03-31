package com.example.planevent.mapper;

import com.example.planevent.controller.dto.auth.AuthorizationInfoDTO;
import com.example.planevent.controller.dto.auth.RegistrationInfoDTO;
import com.example.planevent.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    User toUser(RegistrationInfoDTO dto);

    User toUser(AuthorizationInfoDTO dto);
}

/*
Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    @Mapping(source = "price", target = "formattedPrice")
    ProductDto toDto(Product product);
}
 */