package com.reelline.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "project_files")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectFile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy;
    
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private String originalName;
    
    @Column(nullable = false)
    private String mimeType;
    
    @Column(nullable = false)
    private long size;
    
    @Column(nullable = false)
    private String s3Key;
    
    @Column(nullable = false)
    private String s3Url;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileCategory category;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    
    public enum FileCategory {
        QUOTATION, CONTRACT, PREVIEW_IMAGE, PREVIEW_VIDEO, RAW_PHOTO, FINAL_DELIVERY, OTHER
    }
}
