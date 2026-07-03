package com.reelline.dto.request;

import com.reelline.entity.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateProjectRequest {
    @NotBlank(message = "Project name is required")
    private String name;
    
    @NotBlank(message = "Client name is required")
    private String client;
    
    @NotNull(message = "Event date is required")
    private LocalDate eventDate;
    
    @NotNull(message = "Priority is required")
    private Project.Priority priority;
    
    @NotNull(message = "Project type is required")
    private Project.Type type;
    
    @NotNull(message = "Quotation is required")
    private BigDecimal quotation;
    
    private String thumbnail;
    private List<UUID> teamIds;
}
