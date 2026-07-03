package com.reelline.repository;

import com.reelline.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.organization.id = :orgId")
    java.util.List<User> findByOrganizationId(UUID orgId);
    
    @Query("SELECT u FROM User u WHERE u.organization.id = :orgId AND u.role = :role")
    java.util.List<User> findByOrganizationIdAndRole(UUID orgId, User.Role role);
}
