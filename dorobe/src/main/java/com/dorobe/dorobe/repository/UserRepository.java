package com.dorobe.dorobe.repository;

import org.springframework.stereotype.Repository;
import com.dorobe.dorobe.model.User;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;


@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {

    Optional<User> findByUsername(String username);
    
}
