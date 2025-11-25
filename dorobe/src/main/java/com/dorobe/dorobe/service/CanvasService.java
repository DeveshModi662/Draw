package com.dorobe.dorobe.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
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
        int i = 0 ;
        System.out.println("dk-CanvasService-getCanvasByUserName-"+(++i));
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(username)) {
        System.out.println("dk-CanvasService-getCanvasByUserName-"+(++i));
            throw new RuntimeException("User not authorised") ;
        }
        System.out.println("dk-CanvasService-getCanvasByUserName-"+(++i));
        List<Canvas> canvases = userRepo.findByUsername(username).get().getUserCanvas() ;
        System.out.println("dk-CanvasService-getCanvasByUserName-"+(++i));
        // for(Canvas canvas : canvases) {
        //     System.out.println(canvas.getCanvasName());
        // }        
        for(Canvas canvas : canvases) {
            System.out.println(canvas.getCanvasName() 
            + " " + canvas.getOwner()
            ) ;
            if(canvas.getOwner() != null)
                canvas.getOwner().setUserCanvas(null);
        }
        return canvases ;
    }

    @Transactional
    public Canvas createNewCanvas(Canvas newCanvas, String loggedInUsername) {
        int i = 0 ;
        System.out.println("dk-CanvasService-createNewCanvas-"+(++i));
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(loggedInUsername)) {
        System.out.println("dk-CanvasService-createNewCanvas-"+(++i));
            throw new RuntimeException("User not authorised") ;
        }        
        System.out.println("dk-CanvasService-createNewCanvas-"+(++i));
        User user = userRepo.findByUsername(loggedInUsername).get() ;
        System.out.println("dk-CanvasService-createNewCanvas-loggedInUser = " + user.getUsername());
        System.out.println("dk-CanvasService-createNewCanvas-"+(++i));
        newCanvas.setOwner(user);
        List<String> collabs = newCanvas.getCollaborators() ;
        newCanvas = canvasRepo.save(newCanvas) ;
        boolean hasOwner = false ;
        for(String collab : collabs) {
            System.out.println("dk-CanvasService-createNewCanvas-collab = " + collab);
            if(collab.equals(loggedInUsername)) {
                hasOwner = true ;
            }
            User collabUser = userRepo.findByUsername(collab).get() ;
            collabUser.getUserCanvas().add(newCanvas) ;
            userRepo.save(collabUser) ;
        }
        System.out.println("dk-CanvasService-createNewCanvas-"+(++i));
        // user.getUserCanvas().add((newCanvas = canvasRepo.save(newCanvas))) ;
        // System.out.println("dk-CanvasService-createNewCanvas-"+(++i));
        // userRepo.save(user) ;
        // System.out.println("dk-CanvasService-createNewCanvas-"+(++i));
        newCanvas.getOwner().setUserCanvas(null);
        return newCanvas ;
        // throw new UnsupportedOperationException("Unimplemented method 'createNewCanvas'");
    }

    @Transactional
    public void deleteCanvas(String loggedInUsername, ObjectId canvasIdToDelete) {
        int i = 0 ;
        System.out.println("dk-CanvasService-deleteCanvas-"+(++i));
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(loggedInUsername)) {
        System.out.println("dk-CanvasService-deleteCanvas-"+(++i));
            throw new RuntimeException("User not authorised") ;
        }
        System.out.println("dk-CanvasService-deleteCanvas-"+(++i));
        User user = userRepo.findByUsername(loggedInUsername).get() ;
        System.out.println("dk-CanvasService-deleteCanvas-"+(++i));
        if(!canvasRepo.findById(canvasIdToDelete).get().getOwner().getUsername().equals(loggedInUsername)) {
            System.out.println("dk-CanvasService-deleteCanvas-"+(++i));
            return ; 
        }
        System.out.println("dk-CanvasService-deleteCanvas-"+(++i));
        user.getUserCanvas().removeIf(x -> x.getId().equals(canvasIdToDelete)) ;        
        System.out.println("dk-CanvasService-deleteCanvas-"+(++i));
        userRepo.save(user) ;
        System.out.println("dk-CanvasService-deleteCanvas-"+(++i));
        canvasRepo.deleteById(canvasIdToDelete);
        System.out.println("dk-CanvasService-deleteCanvas-"+(++i));
    }

    public List<CanvasElement> getDrawing(String loggedInUsername, ObjectId canvasId) {
        int i = 0 ;
        System.out.println("dk-CanvasService-getDrawing-"+(++i));
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(loggedInUsername)) {
        System.out.println("dk-CanvasService-getDrawing-"+(++i));
            throw new RuntimeException("User not authorised") ;
        }
        System.out.println("dk-CanvasService-getDrawing-"+(++i));
        List<Canvas> userCanvas = userRepo.findByUsername(loggedInUsername).get().getUserCanvas() ;
        System.out.println("dk-CanvasService-getDrawing-"+(++i));
        Canvas canvas = canvasRepo.findById(canvasId).get() ;
        System.out.println("dk-CanvasService-getDrawing-"+(++i));
        boolean belongsToUser = userCanvas.stream().anyMatch(c -> c.getId().equals(canvas.getId()));
        System.out.println("dk-CanvasService-getDrawing-"+(++i));
        if(!belongsToUser) {
            System.out.println("dk-CanvasService-getDrawing-"+(++i));
            throw new RuntimeException("Canvas not found") ;
        }
        // if(1 == 2
        // || !canvasRepo.findById(canvasId).isPresent() 
        // || !(userRepo.findByUsername(loggedInUsername).get().getUserCanvas().contains(canvasRepo.findById(canvasId).get()))
        // ) {
        //     throw new RuntimeException("Canvas not found") ;
        // }
        System.out.println("dk-CanvasService-getDrawing-"+(++i));
        boolean b1 = drawRepo.findByCanvasId(canvasId).isPresent() ;
        System.out.println("dk-CanvasService-getDrawing-"+(++i));
        List<CanvasElement> drawing = drawRepo.findByCanvasId(canvasId).get() ; // (List<CanvasElement>)
        System.out.println("dk-CanvasService-getDrawing-"+(++i));
        return (drawRepo.findByCanvasId(canvasId).isPresent() ? (List<CanvasElement>)drawRepo.findByCanvasId(canvasId).get() : new ArrayList<CanvasElement>()) ;
    }

    public List<CanvasElement> updateDrawing(String loggedInUsername, ObjectId canvasId, List<CanvasElement> delta) {
        int i = 0 ;
        System.out.println("dk-CanvasService-updateDrawing-"+(++i));
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(loggedInUsername)) {
            System.out.println("dk-CanvasService-updateDrawing-branch-"+(++i));
            throw new RuntimeException("User not authorised") ;
        }
        System.out.println("dk-CanvasService-updateDrawing-"+(++i));
        List<Canvas> userCanvas = userRepo.findByUsername(loggedInUsername).get().getUserCanvas() ;
        System.out.println("dk-CanvasService-updateDrawing-"+(++i));
        Canvas canvas = canvasRepo.findById(canvasId).get() ;
        System.out.println("dk-CanvasService-updateDrawing-"+(++i));
        boolean belongsToUser = userCanvas.stream().anyMatch(c -> c.getId().equals(canvas.getId()));
        System.out.println("dk-CanvasService-updateDrawing-"+(++i));
        if(!belongsToUser) {
            System.out.println("dk-CanvasService-updateDrawing-"+(++i));
            throw new RuntimeException("Canvas not found") ;       
        }
        System.out.println("dk-CanvasService-updateDrawing-"+(++i));
        for(CanvasElement canvasElement : delta) {
            canvasElement.setCanvasId(canvasId);
        }        
        System.out.println("dk-CanvasService-updateDrawing-"+(++i));
        drawRepo.saveAll(delta) ;
        System.out.println("dk-CanvasService-updateDrawing-"+(++i));
        return null ;
    }

    public void clearDrawing(String loggedInUsername, ObjectId canvasId) {
        System.out.println("CanvasService-clearDrawing-1");
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("User not authorised") ;
        }
        System.out.println("CanvasService-clearDrawing-2");
        List<Canvas> userCanvas = userRepo.findByUsername(loggedInUsername).get().getUserCanvas() ;
        Canvas canvas = canvasRepo.findById(canvasId).get() ;
        boolean belongsToUser = userCanvas.stream().anyMatch(c -> c.getId().equals(canvas.getId())) ;
        System.out.println("CanvasService-clearDrawing-3");
        if(!belongsToUser) 
            throw new RuntimeException("Canvas not found") ;
        System.out.println("CanvasService-clearDrawing-4");  
        drawRepo.deleteAllByCanvasId(canvasId) ;
    }

    public ResponseEntity isCanvasOwnedByUser(String loggedInUsername, String canvasId) {   
        System.out.println("dk-isCanvasOwnedByUser-1-"+loggedInUsername);    
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(loggedInUsername)) {
            System.out.println("dk-isCanvasOwnedByUser-2");
            throw new RuntimeException("User not authorised") ;
        }
        System.out.println("dk-isCanvasOwnedByUser-3");
        if(userRepo.findByUsername(loggedInUsername).get().getUserCanvas().stream().anyMatch(
            canvas -> canvas.getId().toHexString().equals(canvasId))) {
            System.out.println("dk-isCanvasOwnedByUser-4");
            return ResponseEntity.ok().build(); 
        }        
        System.out.println("dk-isCanvasOwnedByUser-5");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); 
    }
}
