package com.reelline.repository;

import com.reelline.entity.ProjectFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectFileRepository extends JpaRepository<ProjectFile, UUID> {
    
    Page<ProjectFile> findByProjectIdOrderByCreatedAtDesc(UUID projectId, Pageable pageable);
    
    List<ProjectFile> findByProjectIdAndCategory(UUID projectId, ProjectFile.FileCategory category);
}
