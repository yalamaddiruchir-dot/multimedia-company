package com.reelline.repository;

import com.reelline.entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    
    Page<Activity> findByProjectId(UUID projectId, Pageable pageable);
    
    Page<Activity> findByUserId(UUID userId, Pageable pageable);
}
