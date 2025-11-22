package com.exportservice.exportservice.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.exportservice.exportservice.config.FeignConfig;
import com.exportservice.exportservice.model.CanvasElement;

@FeignClient(name = "DOROBE", configuration = FeignConfig.class)
public interface DorobeService {
    
    @GetMapping("/{loggedInUsername}/canvas/{canvasId}")
    public ResponseEntity isCanvasOwnedByUser(@PathVariable String loggedInUsername, @PathVariable String canvasId);
 
    @GetMapping("/{loggedInUsername}/canvas/{canvasId}/draw")
    public List<CanvasElement> getDrawing(@PathVariable String loggedInUsername, @PathVariable ObjectId canvasId) ;
}
