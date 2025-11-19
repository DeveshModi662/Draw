package com.exportservice.exportservice.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.exportservice.exportservice.service.ExportService;

@RestController
public class ExportController {

    @Autowired
    private ExportService exportService ;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{loggedInUsername}/canvas/{canvasId}")
    public ResponseEntity<byte[]> printCanvas(@PathVariable String loggedInUsername, @PathVariable String canvasId) throws Exception {
        return exportService.printCanvas(loggedInUsername, canvasId) ;
    }
}
