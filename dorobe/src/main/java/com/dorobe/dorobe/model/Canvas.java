package com.dorobe.dorobe.model;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

@Document(collection = "Canvases")
public class Canvas {
    
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id ;

    private String canvasName ;

    // private User owner ;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    // public User getOwner() {
    //     return owner;
    // }

    // public void setOwner(User owner) {
    //     this.owner = owner;
    // }

    public String getCanvasName() {
        return canvasName;
    }

    public void setCanvasName(String canvasName) {
        this.canvasName = canvasName;
    }    
}
