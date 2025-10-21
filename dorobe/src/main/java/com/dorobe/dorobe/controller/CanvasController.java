package com.dorobe.dorobe.controller;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;

import com.dorobe.dorobe.model.Canvas;
import com.dorobe.dorobe.model.CanvasElement;
import com.dorobe.dorobe.service.CanvasService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
public class CanvasController {

    @Autowired
    private CanvasService canvasService ;
    
    @GetMapping("/{loggedInUsername}/canvas")
    public List<Canvas> getCanvasByUsername(@PathVariable String loggedInUsername) {
        System.out.println(SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        return canvasService.getCanvasByUsername(loggedInUsername) ;
    }

    @PostMapping("/{loggedInUsername}/canvas")
    public String createNewCanvas(@RequestBody Canvas newCanvas, @PathVariable String loggedInUsername) {
        canvasService.createNewCanvas(newCanvas, loggedInUsername) ;
        return null ;
    }
    
    @DeleteExchange("/{loggedInUsername}/canvas/{canvasIdToDelete}")
    public void deleteCanvas(@PathVariable String loggedInUsername, @PathVariable ObjectId canvasIdToDelete) {
        canvasService.deleteCanvas(loggedInUsername, canvasIdToDelete) ;
    } 

    @GetMapping("/{loggedInUsername}/canvas/{canvasId}/draw")
    public List<CanvasElement> getDrawing(@PathVariable String loggedInUsername, @PathVariable ObjectId canvasId) {        
        return canvasService.getDrawing(loggedInUsername, canvasId) ; 
    }
    

}
