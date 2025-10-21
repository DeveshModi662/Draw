package com.dorobe.dorobe.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.SystemPropertyUtils;

import com.dorobe.dorobe.model.Canvas;
import com.dorobe.dorobe.model.CanvasElement;
import com.dorobe.dorobe.model.User;
import com.dorobe.dorobe.model.UserPrincipal;
import com.dorobe.dorobe.repository.CanvasElementRepository;
import com.dorobe.dorobe.repository.CanvasRepository;
import com.dorobe.dorobe.repository.UserRepository;

@Service
public class CanvasService {

    @Autowired
    private UserRepository userRepo ;

    @Autowired
    private CanvasRepository canvasRepo ;

    @Autowired
    private CanvasElementRepository drawRepo ;

    public List<Canvas> getCanvasByUsername(String username) {
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(username)) {
            throw new RuntimeException("User not authorised") ;
        }
        List<Canvas> canvases = userRepo.findByUsername(username).get().getUserCanvas() ;
        // for(Canvas canvas : canvases) {
        //     System.out.println(canvas.getCanvasName());
        // }        
        return canvases ;
    }

    @Transactional
    public void createNewCanvas(Canvas newCanvas, String loggedInUsername) {
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("User not authorised") ;
        }
        User user = userRepo.findByUsername(loggedInUsername).get() ;
        user.getUserCanvas().add(canvasRepo.save(newCanvas)) ;
        userRepo.save(user) ;
        // throw new UnsupportedOperationException("Unimplemented method 'createNewCanvas'");
    }

    @Transactional
    public void deleteCanvas(String loggedInUsername, ObjectId canvasIdToDelete) {
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("User not authorised") ;
        }
        User user = userRepo.findByUsername(loggedInUsername).get() ;
        user.getUserCanvas().removeIf(x -> x.getId().equals(canvasIdToDelete)) ;
        userRepo.save(user) ;
        canvasRepo.deleteById(canvasIdToDelete);
    }

    public List<CanvasElement> getDrawing(String loggedInUsername, ObjectId canvasId) {
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("User not authorised") ;
        }
        List<Canvas> userCanvas = userRepo.findByUsername(loggedInUsername).get().getUserCanvas() ;
        Canvas canvas = canvasRepo.findById(canvasId).get() ;
        boolean belongsToUser = userCanvas.stream().anyMatch(c -> c.getId().equals(canvas.getId()));
        if(!belongsToUser) 
            throw new RuntimeException("Canvas not found") ;
        // if(1 == 2
        // || !canvasRepo.findById(canvasId).isPresent() 
        // || !(userRepo.findByUsername(loggedInUsername).get().getUserCanvas().contains(canvasRepo.findById(canvasId).get()))
        // ) {
        //     throw new RuntimeException("Canvas not found") ;
        // }
        boolean b1 = drawRepo.findByCanvasId(canvasId).isPresent() ;
        List<CanvasElement> drawing = drawRepo.findByCanvasId(canvasId).get() ; // (List<CanvasElement>)
        return (drawRepo.findByCanvasId(canvasId).isPresent() ? (List<CanvasElement>)drawRepo.findByCanvasId(canvasId).get() : new ArrayList<CanvasElement>()) ;
    }


}
