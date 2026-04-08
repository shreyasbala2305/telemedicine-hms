package com.hms.notificationservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.notificationservice.dto.NotificationDTO;
import com.hms.notificationservice.model.Notification;
import com.hms.notificationservice.service.NotificationService;

@RestController
@RequestMapping("/notification")
public class NotificationController {
	
	@Autowired
	private NotificationService notificationService;
	
	@PostMapping
	public ResponseEntity<Notification> send(@RequestBody NotificationDTO dto){
		return new ResponseEntity<>(notificationService.send(dto), HttpStatus.CREATED);
	}
	
	@GetMapping("/{recipientId}")
	public List<Notification> getByRecipient(@PathVariable Long recipientId) {
	    return notificationService.getByRecipient(recipientId);
	}

}
