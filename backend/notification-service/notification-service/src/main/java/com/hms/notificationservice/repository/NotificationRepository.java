package com.hms.notificationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.notificationservice.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long>{

}
