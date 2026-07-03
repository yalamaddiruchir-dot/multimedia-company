package com.reelline.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ProjectResponse {
    private UUID id;
    private String code;
    private String name;
    private String client;
    private LocalDate eventDate;
    private String status;
    private String currentStage;
    private String priority;
    private String managerName;
    private UUID managerId;
    private List<UserResponse> team;
    private BigDecimal quotation;
    private int progress;
    private String type;
    private String thumbnail;
}
