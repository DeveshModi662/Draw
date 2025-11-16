package com.exportservice.exportservice.service;

import java.util.List;

import javax.imageio.ImageIO;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics2D;
import org.springframework.http.MediaType;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import org.springframework.http.HttpHeaders;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.exportservice.exportservice.model.CanvasElement;
import com.exportservice.exportservice.repository.CanvasElementRepository;

@Service
public class ExportService {

    @Autowired
    private CanvasElementRepository canvasElementRepo ; 

    private BufferedImage renderCanvas(List<CanvasElement> elements, int width, int height) { 
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = image.createGraphics();

        // Anti-aliasing
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        // White background
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);
        g.setColor(Color.BLACK);
        g.setStroke(new BasicStroke(5, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));

        for (CanvasElement el : elements) {
            if(el.getElementGenerator().getShape().equals("line")) {
                g.drawLine(el.getX1(), el.getY1(), el.getX2(), el.getY2());
            }
            else if(el.getElementGenerator().getShape().equals("rectangle")) {
                g.drawLine(el.getX1(), el.getY1(), el.getX1(), el.getY2());
                g.drawLine(el.getX1(), el.getY1(), el.getX2(), el.getY1());
                g.drawLine(el.getX2(), el.getY2(), el.getX1(), el.getY2());
                g.drawLine(el.getX2(), el.getY2(), el.getX2(), el.getY1());
            }
        }

        g.dispose();
        return image;
    }

    public ResponseEntity<byte[]> printCanvas(String loggedInUsername, String canvasId) {
        List<CanvasElement> canvas = canvasElementRepo.findByCanvasId(new ObjectId(canvasId)).get() ;         
        BufferedImage img = this.renderCanvas(canvas, 1920, 800);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            ImageIO.write(img, "png", baos);
        } catch(Exception e) {
            System.out.println("dk---"+e);
        }       
        return ResponseEntity.ok() 
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=canvas.png") 
            .contentType(MediaType.IMAGE_PNG)
            .body(baos.toByteArray()) ;
        // return (ResponseEntity<byte[]>) ResponseEntity.ok() ;
    }

}
