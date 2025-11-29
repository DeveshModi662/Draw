package com.collabservice.collabservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.collabservice.collabservice.dto.CursorDto;

@Controller
public class WsController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/canvas/{canvasId}/stroke")
    @SendTo("/topic/canvas/{canvasId}/stroke")
    public void shareStroke(@DestinationVariable String canvasId, String mssg) {
        System.out.println("dk-shareStroke-" + mssg) ;
        messagingTemplate.convertAndSend(
            "/topic/canvas/" + canvasId + "/stroke",
            mssg
        );
        // return mssg ;
    }
    @MessageMapping("/canvas/{canvasId}/cursor")
    @SendTo("/topic/canvas/{canvasId}/cursor")
    public CursorDto broadcastCursor(
            @DestinationVariable String canvasId,
            CursorDto message) {
        return message;
    }
}
