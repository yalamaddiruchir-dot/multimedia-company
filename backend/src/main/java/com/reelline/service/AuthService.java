package com.reelline.service;

import com.reelline.dto.request.LoginRequest;
import com.reelline.dto.response.AuthResponse;
import com.reelline.dto.response.UserResponse;
import com.reelline.entity.User;
import com.reelline.repository.UserRepository;
import com.reelline.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            
            if (user.getFailedLoginAttempts() >= 5) {
                user.setStatus(User.Status.LOCKED);
                user.setLockedUntil(Instant.now().plusSeconds(900)); // 15 minutes
            }
            
            userRepository.save(user);
            throw new RuntimeException("Invalid email or password");
        }
        
        if (user.getStatus() == User.Status.LOCKED) {
            if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(Instant.now())) {
                throw new RuntimeException("Account is locked. Try again later.");
            } else {
                user.setStatus(User.Status.ACTIVE);
                user.setFailedLoginAttempts(0);
                user.setLockedUntil(null);
            }
        }
        
        String accessToken = jwtTokenProvider.generateAccessToken(
            user.getId(), user.getEmail(), user.getRole().name()
        );
        
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        
        user.setLastLoginAt(Instant.now());
        user.setFailedLoginAttempts(0);
        userRepository.save(user);
        
        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .user(mapToUserResponse(user))
            .build();
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
