package com.hms.inventoryservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.hms.inventoryservice.model.InventoryItem;

public interface InventoryRepository extends MongoRepository<InventoryItem, String>{

}
