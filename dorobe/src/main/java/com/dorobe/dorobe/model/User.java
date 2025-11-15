package com.dorobe.dorobe.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.mongodb.lang.NonNull;

@Document(collection = "Users")
public class User {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id ;

    @NonNull
    @Indexed(unique = true)
    private String username ;

    @NonNull
    private String password ;

    private String jsonWebToken ;    

    @Transient
    private String otp ;

    public String getOtp() {
        return otp;
    }
    public void setOtp(String otp) {
        this.otp = otp;
    }
    @DBRef(lazy = true)  // Why ??
    private List<Canvas> userCanvas = new ArrayList<>() ;

    public List<Canvas> getUserCanvas() {
        return userCanvas;
    }
    public void setUserCanvas(List<Canvas> userCanvas) {
        this.userCanvas = userCanvas;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    private String[] roles ;
    public ObjectId getId() {
        return id;
    }
    public void setId(ObjectId id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String[] getRoles() {
        return roles;
    }
    public void setRoles(String[] roles) {
        this.roles = roles;
    }
    @Override
    public String toString() {
        return "User [id=" + id + ", username=" + username + ", roles=" + Arrays.toString(roles) + "]";
    }
    public User(ObjectId id, String username, String[] roles) {
        this.id = id;
        this.username = username;
        this.roles = roles;
    }
    public String getJsonWebToken() {
        return jsonWebToken;
    }
    public void setJsonWebToken(String jsonWebToken) {
        this.jsonWebToken = jsonWebToken;
    }
    
}
