package com.dishcover.backend.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dishcover.backend.dto.response.ValidationResponse;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IUserRepository;
import com.dishcover.backend.security.JwtService;
import com.dishcover.backend.services.FavoriteRecipeService;
import com.dishcover.backend.tools.SpringResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class FavoriteRecipeController {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private FavoriteRecipeService favoriteRecipeService;

    @Autowired
    private JwtService jwtService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'GESTOR')")
    @PostMapping("recipe/{id}/favorite")
    public ResponseEntity<?> saveFavoriteRecipe(HttpServletRequest header, @PathVariable Long id) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);
        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String userName = validationResponse.getUsername();
        Optional<UserModel> userOptional = userRepository.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();

        ResponseEntity<?> response;

        try {
            response = favoriteRecipeService.saveFavoriteRecipe(id, user);
        } catch (Exception e) {
            response = SpringResponse.errorSavingFavoriteRecipe();
        }
        return response;

    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'GESTOR')")
    @GetMapping("recipes/favorite")
    public ResponseEntity<?> getMyFavoriteRecipes(HttpServletRequest header) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);
        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String userName = validationResponse.getUsername();
        Optional<UserModel> userOptional = userRepository.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();

        ResponseEntity<?> response;

        try {
            response = favoriteRecipeService.getMyFavoriteRecipes(user);
        } catch (Exception e) {
            response = SpringResponse.errorGettingFavoriteRecipes();
        }
        return response;

    }

    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')")
    @GetMapping("user/{id}/recipes/favorite")
    public ResponseEntity<?> getFavoriteRecipesByUserId(@PathVariable Long id) {
        Optional<UserModel> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();

        ResponseEntity<?> response;

        try {
            response = favoriteRecipeService.getMyFavoriteRecipes(user);
        } catch (Exception e) {
            response = SpringResponse.errorGettingFavoriteRecipes();
        }
        return response;
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'GESTOR')")
    @DeleteMapping("recipe/{id}/favorite")
    public ResponseEntity<?> deleteFavoriteRecipe(HttpServletRequest header, @PathVariable Long id) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);
        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String userName = validationResponse.getUsername();
        Optional<UserModel> userOptional = userRepository.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();

        ResponseEntity<?> response;

        try {
            response = favoriteRecipeService.deleteFavoriteRecipe(id, user);
        } catch (Exception e) {
            response = SpringResponse.errorSavingFavoriteRecipe();
        }
        return response;

    }

}