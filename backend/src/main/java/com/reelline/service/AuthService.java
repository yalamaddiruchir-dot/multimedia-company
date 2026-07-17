package com.reelline.service;

import com.reelline.dto.request.LoginRequest;
import com.reelline.dto.request.RegisterRequest;
import com.reelline.dto.response.AuthResponse;
import com.reelline.dto.response.RegisterResponse;
import com.reelline.dto.response.UserResponse;
import com.reelline.entity.Organization;
import com.reelline.entity.User;
import com.reelline.repository.OrganizationRepository;
import com.reelline.repository.UserRepository;
import com.reelline.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
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
    
    public RegisterResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        // Get or create default organization
        Organization org = organizationRepository.findAll().stream().findFirst()
            .orElseGet(() -> {
                Organization newOrg = Organization.builder()
                    .name("Default Organization")
                    .slug("default-org")
                    .email("default@reelline.io")
                    .address("123 Main St")
                    .city("Hyderabad")
                    .state("Telangana")
                    .country("India")
                    .plan(Organization.Plan.BASIC)
                    .build();
                return organizationRepository.save(newOrg);
            });
        
        // Parse role
        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role. Must be one of: OWNER, MANAGER, DATA_COPY, LIGHTROOM, VIDEO, ALBUM, EDITOR");
        }
        
        // Generate random color and initials
        String[] colors = {"#2563EB", "#7C3AED", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#EC4899"};
        String color = colors[new Random().nextInt(colors.length)];
        String initials = request.getName().substring(0, Math.min(2, request.getName().length())).toUpperCase();
        
        // Create user
        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .role(role)
            .organization(org)
            .status(User.Status.ACTIVE)
            .color(color)
            .initials(initials)
            .emailVerified(true)
            .build();
        
        user = userRepository.save(user);
        
        return RegisterResponse.builder()
            .message("User registered successfully")
            .user(mapToUserResponse(user))
            .build();
    }
    
    // Exchanges a valid, non-expired refresh token for a brand-new access token
    // (and a rotated refresh token, so a leaked/old refresh token stops working
    // once used). This was previously a TODO stub in AuthController - the
    // frontend now calls this automatically the moment an access token expires,
    // instead of forcing the user to log in again every 15 minutes.
    public AuthResponse refreshAccessToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        var userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != User.Status.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(
            user.getId(), user.getEmail(), user.getRole().name()
        );
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
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
