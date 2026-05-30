package com.dishcover.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.dishcover.backend.dto.request.LoginRequest;
import com.dishcover.backend.dto.response.LoginResponse;
import com.dishcover.backend.security.JwtService;

@Service
public class AuthService {

     @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;
    
    public LoginResponse login(LoginRequest request, String role) {
        Authentication authentication = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        
        if (authentication.isAuthenticated()) {
            return LoginResponse.builder()
            .token(jwtService.generateToken(request.getUsername()))
            .role(role)
            .build();
            
        } else {
            throw new RuntimeException("Invalid login");
        }
    }
    
}