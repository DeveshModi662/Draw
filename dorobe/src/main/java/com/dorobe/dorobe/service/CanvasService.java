package com.dorobe.dorobe.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.SystemPropertyUtils;

import com.dorobe.dorobe.model.Canvas;
import com.dorobe.dorobe.model.User;
import com.dorobe.dorobe.model.UserPrincipal;
import com.dorobe.dorobe.repository.CanvasRepository;
import com.dorobe.dorobe.repository.UserRepository;

@Service
public class CanvasService {

    @Autowired
    private UserRepository userRepo ;

    @Autowired
    private CanvasRepository canvasRepo ;

    public List<Canvas> getCanvasByUsername(String username) {
        if(!((UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser().getUsername().equals(username)) {
            throw new RuntimeException("User not authorised") ;
        }
        List<Canvas> canvases = userRepo.findByUsername(username).get().getUserCanvas() ;
        for(Canvas canvas : canvases) {
            System.out.println(canvas.getCanvasName());
        }        
        return canvases ;
    }

    public void createNewCanvas(Canvas newCanvas, String loggedInUsername) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createNewCanvas'");
    }


}
