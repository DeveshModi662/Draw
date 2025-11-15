package com.dorobe.dorobe.service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class OtpService {
    private static final long TIME_TO_LIVE = 2 * 60 * 1000 ;
    private static final Map<String,  OtpData> otpStorage = new ConcurrentHashMap<>() ;

    
    public String generateOtp(String email) {
        String otp = String.format("%06d", (new Random()).nextInt(999999));
        otpStorage.put(email, new OtpData(otp, Instant.now().toEpochMilli()));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        System.out.println("dk-OtpService-verifyOtp-1") ;
        OtpData data = otpStorage.get(email);
        System.out.println("dk-OtpService-verifyOtp-2") ;
        if (data == null) return false;    
        System.out.println("dk-OtpService-verifyOtp-3") ;
        if (!data.otp.equals(otp)) return false;
        System.out.println("dk-OtpService-verifyOtp-4") ;

        long currentTime = Instant.now().toEpochMilli();
        if (currentTime - data.creationTime > TIME_TO_LIVE) {
            otpStorage.remove(email);
            return false;
        }
        System.out.println("dk-OtpService-verifyOtp-5") ;

        otpStorage.remove(email);
        
        System.out.println("dk-OtpService-verifyOtp-6") ;
        return true;
    }

    private static class OtpData {
        String otp ;
        long creationTime ;
        OtpData(String otp, long creationTime) {
            this.otp = otp ;
            this.creationTime = creationTime ;
        } 
    }

}
