package com.hms.inventoryservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hms.inventoryservice.client.NotificationClient;
import com.hms.inventoryservice.dto.EmailNotificationDTO;
import com.hms.inventoryservice.dto.InventoryDTO;
import com.hms.inventoryservice.model.InventoryItem;
import com.hms.inventoryservice.repository.InventoryRepository;

@Service
public class InventoryService {
	
	@Value("${admin.email}")
	private String adminEmail;
	
	@Autowired
	private InventoryRepository inventoryRepository;
	
	@Autowired
	private NotificationClient notificationClient;
	
	public void reduceStock(String itemName, int quantity) {
		InventoryItem item = inventoryRepository.findByName(itemName);
		if(item == null)
			throw new RuntimeException("Item not found");
		
		item.setQuantity(item.getQuantity()-quantity);
		inventoryRepository.save(item);
		
		if(item.getQuantity()<item.getThreshold()) {
			EmailNotificationDTO email = new EmailNotificationDTO();
			email.setTo(adminEmail);
			email.setSubject("Low Stock Alert: " + itemName);
			email.setBody("Current stock is below threshold: " + item.getQuantity());
			notificationClient.sendEmail(email);
		}
	}
	
	public InventoryItem createItem(InventoryDTO dto) {
		InventoryItem item = new InventoryItem();
		item.setName(dto.name);
		item.setQuantity(dto.quantity);
		item.setThreshold(dto.threshold);
		return inventoryRepository.save(item);
	}
	
	public List<InventoryItem> getAll(){
		return inventoryRepository.findAll();
	}
	
	public InventoryItem updateQuantity(String id, int quantity) {
		InventoryItem item = inventoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Item not found"));
		item.setQuantity(quantity);
		return inventoryRepository.save(item);
	}
	
	public void deleteItem(String id) {
		inventoryRepository.deleteById(id);
	}

}
