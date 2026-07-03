package com.reelline.controller;

import com.reelline.dto.response.UserResponse;
import com.reelline.entity.User;
import com.reelline.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers(@AuthenticationPrincipal User currentUser) {
        List<User> users = userRepository.findByOrganizationId(currentUser.getOrganization().getId());
        List<UserResponse> response = users.stream()
            .map(this::mapToUserResponse)
            .toList();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mapToUserResponse(user));
    }
    
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .color(user.getColor())
            .initials(user.getInitials().isEmpty() ? 
                user.getName().substring(0, Math.min(2, user.getName().length())).toUpperCase() : 
                user.getInitials())
            .status(user.getStatus().name())
            .phone(user.getPhone())
            .avatar(user.getAvatar())
            .build();
    }
}
