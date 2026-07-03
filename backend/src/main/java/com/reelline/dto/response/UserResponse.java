package com.reelline.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private String role;
    private String color;
    private String initials;
    private String status;
    private String phone;
    private String avatar;
}
