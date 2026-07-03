package com.reelline.repository;

import com.reelline.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    
    List<Assignment> findByProjectId(UUID projectId);
    
    List<Assignment> findByUserId(UUID userId);
    
    boolean existsByProjectIdAndUserId(UUID projectId, UUID userId);
}
