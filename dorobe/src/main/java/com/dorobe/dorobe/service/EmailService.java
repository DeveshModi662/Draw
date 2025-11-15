package com.dorobe.dorobe.service;

import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;


@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailer ;

    @Autowired
    private OtpService otpService ;

    private static final Pattern GMAIL_PATTERN =
            Pattern.compile("^[a-zA-Z0-9._%+-]+@gmail\\.com$", Pattern.CASE_INSENSITIVE);
    
    private static final Set<String> TEMP_EMAIL_DOMAINS = Set.of(
        "tempmail.com", "10minutemail.com", "guerrillamail.com",
        "mailinator.com", "yopmail.com", "dispostable.com",
        "maildrop.cc", "trashmail.com", "fakeinbox.com"
    );

    public void sendOtp(String toEmail) throws Exception {
        System.out.println("dk-EmailService-sendOtp()");
        if(!isValidEmail(toEmail)) {
        System.out.println("dk-EmailService-emailNotValid()");
            throw new Exception("Only valid gmail ids allowed") ;
        }
        SimpleMailMessage mssg = new SimpleMailMessage() ;
        mssg.setTo(toEmail) ;
        mssg.setSubject("OTP from draw app: Deleteme ");
        mssg.setText("Expires in 2 min. OTP = " + otpService.generateOtp(toEmail)) ;
        mailer.send(mssg) ;
    }

    private boolean isValidEmail(String email) {
        System.out.println("dk-EmailService-isValidEmail");
        if (email == null || email.isBlank()) return false;

        // Must match @gmail.com format
        if (!GMAIL_PATTERN.matcher(email).matches()) return false;

        // Defensive check — though gmail.com is the only allowed domain, 
        // still verify it’s not a spoof like "gmail.com.fakeinbox.com"
        String domain = email.substring(email.indexOf("@") + 1).toLowerCase();
        if (TEMP_EMAIL_DOMAINS.contains(domain)) return false;

        return true;

    }
}
