package com.hms.inventoryservice.model;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
@Document(collection = "inventory-items")
public class InventoryItem {

	@Id
	private String id;
	private String name;
    private int quantity;
    private int threshold;
	
}
