package com.exportservice.exportservice.service;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Service
public class ExportService {

    public String printCanvas(String loggedInUsername, Integer canvasId) {
        return "Success" ;
    }

}
