package com.hms.inventoryservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.inventoryservice.dto.InventoryDTO;
import com.hms.inventoryservice.model.InventoryItem;
import com.hms.inventoryservice.repository.InventoryRepository;

@Service
public class InventoryService {
	
	@Autowired
	private InventoryRepository inventoryRepository;
	
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
