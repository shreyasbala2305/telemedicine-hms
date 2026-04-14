package com.hms.notificationservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.notificationservice.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>{

	List<Notification> findByRecipientId(Long id);

}
