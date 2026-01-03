package com.dorobe.dorobe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.dorobe.dorobe.model.CanvasElement;

import java.util.List;
import java.util.Optional;


public interface CanvasElementRepository extends MongoRepository<CanvasElement, ObjectId> {
    Optional<List<CanvasElement>> findByCanvasId(ObjectId canvasId) ;
    void deleteAllByCanvasId(ObjectId canvasId) ;    
    Optional<List<CanvasElement>> findByEleId(String eleId) ;
}
