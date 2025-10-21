package com.dorobe.dorobe.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.dorobe.dorobe.model.CanvasElement;

public interface CanvasElementRepository extends MongoRepository<CanvasElement, String> {

}
