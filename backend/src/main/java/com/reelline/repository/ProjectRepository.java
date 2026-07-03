package com.reelline.repository;

import com.reelline.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    
    @Query("SELECT p FROM Project p WHERE p.organization.id = :orgId ORDER BY p.createdAt DESC")
    Page<Project> findByOrganizationId(UUID orgId, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE p.organization.id = :orgId AND p.status = :status ORDER BY p.createdAt DESC")
    Page<Project> findByOrganizationIdAndStatus(UUID orgId, Project.Status status, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE p.organization.id = :orgId AND p.currentStage = :stage ORDER BY p.createdAt DESC")
    List<Project> findByOrganizationIdAndCurrentStage(UUID orgId, Project.Stage stage);
    
    @Query("SELECT p FROM Project p WHERE p.organization.id = :orgId AND p.eventDate < :today AND p.status <> 'COMPLETED'")
    List<Project> findOverdueProjects(UUID orgId, LocalDate today);
    
    @Query("SELECT p FROM Project p WHERE p.organization.id = :orgId AND p.eventDate = :tomorrow")
    List<Project> findByEventDate(UUID orgId, LocalDate tomorrow);
    
    @Query("SELECT p FROM Project p WHERE p.organization.id = :orgId AND p.client = :client")
    List<Project> findByOrganizationIdAndClient(UUID orgId, String client);
    
    @Query("SELECT p FROM Project p WHERE p.manager.id = :managerId")
    List<Project> findByManagerId(UUID managerId);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.organization.id = :orgId AND p.status = :status")
    long countByOrganizationIdAndStatus(UUID orgId, Project.Status status);
    
    @Query("SELECT p FROM Project p WHERE p.organization.id = :orgId AND p.eventDate BETWEEN :startDate AND :endDate")
    List<Project> findByOrganizationIdAndEventDateBetween(UUID orgId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT p FROM Project p JOIN FETCH p.assignments a JOIN FETCH a.user WHERE p.id = :id")
    Optional<Project> findByIdWithAssignments(@Param("id") UUID id);
    
    @Query("SELECT p FROM Project p WHERE p.organization.id = :orgId AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.client) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.code) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Project> searchProjects(UUID orgId, String query, Pageable pageable);
}
