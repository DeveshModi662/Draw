package com.dorobe.dorobe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.dorobe.dorobe.model.Canvas;
import com.dorobe.dorobe.service.CanvasService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class CanvasController {

    @Autowired
    private CanvasService canvasService ;
    
    @GetMapping("/canvas/{loggedInUsername}")
    public List<Canvas> getCanvasByUsername(@PathVariable String loggedInUsername) {
        System.out.println(SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        return canvasService.getCanvasByUsername(loggedInUsername) ;
    }

    @PostMapping("/canvas/{loggedInUsername}")
    public String createNewCanvas(@RequestBody Canvas newCanvas, @PathVariable String loggedInUsername) {
        canvasService.createNewCanvas(newCanvas, loggedInUsername) ;
        return null ;
    }
    

}
