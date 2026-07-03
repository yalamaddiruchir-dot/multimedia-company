package com.reelline.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "revisions")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Revision {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RevisionType type;
    
    @Column(nullable = false)
    private int version;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RevisionStatus status = RevisionStatus.PENDING;
    
    @Column(nullable = false)
    @Builder.Default
    private boolean isChargeable = false;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal chargeAmount;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by_id")
    private User requestedBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    
    private Instant completedAt;
    
    public enum RevisionType {
        TEASER_FULL, TEASER_MINOR, FULL_VIDEO, ALBUM_DESIGN, ALBUM_MINOR
    }
    
    public enum RevisionStatus {
        PENDING, IN_PROGRESS, COMPLETED, REJECTED
    }
}
