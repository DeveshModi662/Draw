package com.dorobe.dorobe.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document(collection = "Canvases")
public class Canvas {
    
    @Id
    private String id ;

    private String canvasName ;

    // private User owner ;

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
