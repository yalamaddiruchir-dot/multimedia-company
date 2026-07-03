package com.reelline.repository;

import com.reelline.entity.ProjectStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectStageRepository extends JpaRepository<ProjectStage, UUID> {
    
    List<ProjectStage> findByProjectId(UUID projectId);
    
    Optional<ProjectStage> findByProjectIdAndStage(UUID projectId, com.reelline.entity.Project.Stage stage);
}
