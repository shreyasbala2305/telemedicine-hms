package com.hms.inventoryservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.inventoryservice.dto.InventoryDTO;
import com.hms.inventoryservice.model.InventoryItem;
import com.hms.inventoryservice.service.InventoryService;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

	@Autowired
	private InventoryService inventoryService;
	
	@PostMapping
	public ResponseEntity<InventoryItem> create(@RequestBody InventoryDTO dto){
		return ResponseEntity.ok(inventoryService.createItem(dto));
	}
	
	@GetMapping
	public ResponseEntity<List<InventoryItem>> allItems(){
		return ResponseEntity.ok(inventoryService.getAll());
	}
	
	@GetMapping("/{id}/quantity")
	public ResponseEntity<InventoryItem> updateQuantity(@PathVariable String id, @RequestParam int quantity){
		return ResponseEntity.ok(inventoryService.updateQuantity(id, quantity));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteItem(@PathVariable String id){
		inventoryService.deleteItem(id);
		return ResponseEntity.noContent().build();
	}
	
}
