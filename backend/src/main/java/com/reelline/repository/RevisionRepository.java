package com.reelline.repository;

import com.reelline.entity.Revision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RevisionRepository extends JpaRepository<Revision, UUID> {
    
    List<Revision> findByProjectId(UUID projectId);
    
    List<Revision> findByProjectIdAndType(UUID projectId, Revision.RevisionType type);
    
    long countByProjectIdAndTypeAndIsChargeable(UUID projectId, Revision.RevisionType type, boolean isChargeable);
}
