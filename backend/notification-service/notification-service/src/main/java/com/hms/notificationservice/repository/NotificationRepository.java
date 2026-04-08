package com.hms.notificationservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.notificationservice.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long>{

	List<Notification> findByRecipientById(Long recipientId);

}
