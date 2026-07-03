package com.reelline.repository;

import com.reelline.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    
    Page<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    
    long countByUserIdAndUnreadTrue(UUID userId);
    
    @Modifying
    @Query("UPDATE Notification n SET n.unread = false WHERE n.user.id = :userId")
    int markAllAsRead(UUID userId);
}
