package com.dishcover.backend.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.dishcover.backend.dto.request.LoginRequest;
import com.dishcover.backend.dto.request.RegisterRequest;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IUserRepository;
import com.dishcover.backend.services.AuthService;
import com.dishcover.backend.services.UserService;
import com.dishcover.backend.tools.SpringResponse;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @PostMapping(path = "/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
         Optional<UserModel> userOptional = userRepository.findByUsername(request.getUsername());

        if(!userOptional.isPresent()){
            return SpringResponse.userNotFound();
        }
        String passwordRequest = request.getPassword();
        String userPassword = userOptional.get().getPassword();
         if(!passwordEncoder.matches(passwordRequest,userPassword))
             return SpringResponse.wrongPassword();

        return ResponseEntity.ok(authService.login(request, userOptional.get().getRole().toString()));
    }

    @PostMapping(path = "/register")
    public UserModel registerUser(@RequestBody RegisterRequest request) {
        return this.userService.registerUser(request);
    }
}
