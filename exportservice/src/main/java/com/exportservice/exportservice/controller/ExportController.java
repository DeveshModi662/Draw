package com.exportservice.exportservice.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.exportservice.exportservice.service.ExportService;

@RestController
public class ExportController {

    @Autowired
    private ExportService exportService ;

    @PostMapping("/{loggedInUsername}/canvas/{canvasId}")
    public String printCanvas(@PathVariable String loggedInUsername, @PathVariable Integer canvasId) {
        return exportService.printCanvas(loggedInUsername, canvasId) ;
    }
}
