package com.dorobe.dorobe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.dorobe.dorobe.model.Canvas;

public interface CanvasRepository extends MongoRepository<Canvas, ObjectId> {

}
