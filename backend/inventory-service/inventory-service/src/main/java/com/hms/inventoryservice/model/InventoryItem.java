package com.hms.inventoryservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "inventory_items")
public class InventoryItem {

	@Id
	private String id;
	private String name;
    private int quantity;
    private int threshold;
	
}
