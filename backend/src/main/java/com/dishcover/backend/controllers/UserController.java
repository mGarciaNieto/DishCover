package com.dishcover.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dishcover.backend.dto.request.EditUserRequest;
import com.dishcover.backend.dto.request.PasswordRequest;
import com.dishcover.backend.dto.response.ValidationResponse;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.security.JwtService;
import com.dishcover.backend.services.UserService;
import com.dishcover.backend.tools.SpringResponse;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(HttpServletRequest header) {
        System.out.println(header);
        ArrayList<UserModel> listUsers = userService.getUsers();
        return ResponseEntity.ok(listUsers);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/user")
    public ResponseEntity<?> getMyUser(HttpServletRequest header) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);

        if(!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }
        String username = validationResponse.getUsername();
        Optional<UserModel> userOptional = userService.getUserByUsername(username);

        if (!userOptional.isPresent()) {
            return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();

        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{id}")
    public Optional<UserModel> getUserById(@PathVariable("id") Long id) {
        return userService.getUserById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PatchMapping("/user")
    public ResponseEntity<?> changePassword(HttpServletRequest header, @RequestBody PasswordRequest request) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);

        if(!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }
        String username = validationResponse.getUsername();

        return userService.changePassword(username, request.getPassword());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/user/{id}")
    public ResponseEntity<?> editUserById(@PathVariable Long id, @RequestBody EditUserRequest request) {
        return userService.editUserById(id, request);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping("/user")
    public ResponseEntity<?> editMyUser(HttpServletRequest header, @RequestBody EditUserRequest request) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);

        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String username = validationResponse.getUsername();
        return userService.editUser(username, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "/user/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable("id") Long id) {
        return userService.deleteUserById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @DeleteMapping(path = "/user")
    public ResponseEntity<?> deleteMyUser(HttpServletRequest header) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);

        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String username = validationResponse.getUsername();
        return userService.deleteUserByUsername(username);
    }
}