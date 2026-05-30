package com.dishcover.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dishcover.backend.dto.request.EditUserRequest;
import com.dishcover.backend.dto.request.RegisterRequest;
import com.dishcover.backend.models.RoleModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IUserRepository;
import com.dishcover.backend.tools.SpringResponse;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private IUserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ArrayList<UserModel> getUsers() {
        return (ArrayList<UserModel>) userRepository.findAll();
    }

    public UserModel registerUser(RegisterRequest request) {
        UserModel user = new UserModel();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(RoleModel.USER);
        user.setActive(true);

        return userRepository.save(user);
    }

    public Optional<UserModel> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<UserModel> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public ResponseEntity<?> changePassword(String username, String password) {
        Optional<UserModel> userOptional = userRepository.findByUsername(username);

        if (!userOptional.isPresent()) {
            return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();
        user.setPassword(passwordEncoder.encode(password));
        
        try {
            userRepository.save(user);
            return SpringResponse.passwordChanged();
        } catch (Exception ex) {
            return SpringResponse.errorChangingpassword();
        }
    }

    public ResponseEntity<?> editUserById(Long id, EditUserRequest request) {
        Optional<UserModel> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return SpringResponse.userNotFound();
        }

        try {
            UserModel user = userOptional.get();
            user.setActive(request.isActive());
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPassword(request.getPassword());
            user.setRole(RoleModel.valueOf(request.getRole()));
            user.setUsername(request.getUsername());

            userRepository.save(user);
            return SpringResponse.userEdited();
        } catch (Exception ex) {
            return SpringResponse.errorEditingUser();
        }
    }

    public ResponseEntity<?> editUser(String username, EditUserRequest request) {
        Optional<UserModel> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
            return SpringResponse.userNotFound();
        }

        try {
            UserModel user = userOptional.get();
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setUsername(request.getUsername());

            userRepository.save(user);
            return SpringResponse.userEdited();
        } catch (Exception ex) {
            return SpringResponse.errorEditingUser();
        }
    }
    
    public ResponseEntity<?> deleteUserById(Long id) {
        try {
            userRepository.deleteById(id);
            return SpringResponse.userDeleted();
        } catch (Exception ex) {
            return SpringResponse.errorDeletingUser();
        }
    }

    public ResponseEntity<?> deleteUserByUsername(String username) {
        Optional<UserModel> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
            return SpringResponse.userNotFound();
        }
        UserModel user = userOptional.get();
        Long id = user.getId();
        try {
            userRepository.deleteById(id);
            return SpringResponse.userDeleted();
        } catch (Exception ex) {
            return SpringResponse.errorDeletingUser();
        }
    }

}