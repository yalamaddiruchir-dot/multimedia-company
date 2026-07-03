package com.reelline.service;

import com.reelline.dto.request.CreateProjectRequest;
import com.reelline.dto.response.ProjectResponse;
import com.reelline.dto.response.UserResponse;
import com.reelline.entity.Assignment;
import com.reelline.entity.Project;
import com.reelline.entity.User;
import com.reelline.repository.AssignmentRepository;
import com.reelline.repository.ProjectRepository;
import com.reelline.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    
    public Page<ProjectResponse> getProjects(UUID orgId, String status, Pageable pageable) {
        Page<Project> projects;
        
        if (status != null && !status.isEmpty()) {
            projects = projectRepository.findByOrganizationIdAndStatus(
                orgId, Project.Status.valueOf(status.toUpperCase()), pageable
            );
        } else {
            projects = projectRepository.findByOrganizationId(orgId, pageable);
        }
        
        return projects.map(this::mapToProjectResponse);
    }
    
    public ProjectResponse getProject(UUID projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToProjectResponse(project);
    }
    
    @Transactional
    public ProjectResponse createProject(UUID orgId, UUID userId, CreateProjectRequest request) {
        User manager = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Manager not found"));
        
        long projectCount = projectRepository.count();
        String code = "PRJ-" + String.format("%04d", projectCount + 2842);
        
        Project project = Project.builder()
            .organization(manager.getOrganization())
            .code(code)
            .name(request.getName())
            .client(request.getClient())
            .eventDate(request.getEventDate())
            .priority(request.getPriority())
            .type(request.getType())
            .quotation(request.getQuotation())
            .thumbnail(request.getThumbnail())
            .manager(manager)
            .createdBy(manager)
            .build();
        
        project = projectRepository.save(project);
        
        // Create assignments
        if (request.getTeamIds() != null && !request.getTeamIds().isEmpty()) {
            for (UUID teamId : request.getTeamIds()) {
                User user = userRepository.findById(teamId).orElse(null);
                if (user != null) {
                    Assignment assignment = Assignment.builder()
                        .project(project)
                        .user(user)
                        .stage(project.getCurrentStage())
                        .build();
                    assignmentRepository.save(assignment);
                }
            }
        }
        
        return mapToProjectResponse(project);
    }
    
    @Transactional
    public ProjectResponse updateProjectStage(UUID projectId, String stageName) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        
        Project.Stage newStage = Project.Stage.valueOf(stageName.toUpperCase());
        project.setCurrentStage(newStage);
        
        // Update progress based on stage
        int stageIndex = Arrays.asList(Project.Stage.values()).indexOf(newStage);
        int totalStages = Project.Stage.values().length;
        project.setProgress((int) ((stageIndex + 1) * 100.0 / totalStages));
        
        // Update status if last stage
        if (newStage == Project.Stage.DELIVERY) {
            project.setStatus(Project.Status.COMPLETED);
            project.setProgress(100);
        }
        
        project = projectRepository.save(project);
        return mapToProjectResponse(project);
    }
    
    private ProjectResponse mapToProjectResponse(Project project) {
        List<Assignment> assignments = assignmentRepository.findByProjectId(project.getId());
        List<UserResponse> team = assignments.stream()
            .map(a -> mapToUserResponse(a.getUser()))
            .toList();
        
        return ProjectResponse.builder()
            .id(project.getId())
            .code(project.getCode())
            .name(project.getName())
            .client(project.getClient())
            .eventDate(project.getEventDate())
            .status(project.getStatus().name())
            .currentStage(project.getCurrentStage().name())
            .priority(project.getPriority().name())
            .managerName(project.getManager().getName())
            .managerId(project.getManager().getId())
            .team(team)
            .quotation(project.getQuotation())
            .progress(project.getProgress())
            .type(project.getType().name())
            .thumbnail(project.getThumbnail())
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
