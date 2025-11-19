package com.exportservice.exportservice.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.exportservice.exportservice.model.CanvasElement;

import java.util.List;
import java.util.Optional;

// @Repository
public interface CanvasElementRepository 
// extends MongoRepository<CanvasElement, ObjectId> 
{
    Optional<List<CanvasElement>> findByCanvasId(ObjectId canvasId) ;
    void deleteAllByCanvasId(ObjectId canvasId) ;
}
