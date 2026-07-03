package com.reelline.controller;

import com.reelline.dto.request.CreateProjectRequest;
import com.reelline.dto.response.ProjectResponse;
import com.reelline.entity.User;
import com.reelline.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    
    private final ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getProjects(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(
            projectService.getProjects(user.getOrganization().getId(), status, pageable)
        );
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<ProjectResponse> createProject(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(
            projectService.createProject(user.getOrganization().getId(), user.getId(), request)
        );
    }
    
    @PutMapping("/{id}/stage")
    public ResponseEntity<ProjectResponse> updateStage(
            @PathVariable UUID id,
            @RequestParam String stage) {
        return ResponseEntity.ok(projectService.updateProjectStage(id, stage));
    }
}
