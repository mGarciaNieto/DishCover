package com.dishcover.backend.controllers;

// Autor: Manuel García Nieto
// Controlador REST encargado de exponer las operaciones principales de recetas.

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dishcover.backend.dto.request.RecipeRequest;
import com.dishcover.backend.dto.response.ValidationResponse;
import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IUserRepository;
import com.dishcover.backend.security.JwtService;
import com.dishcover.backend.services.RecipeService;
import com.dishcover.backend.tools.SpringResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class RecipeController {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private JwtService jwtService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/recipe")
    public ResponseEntity<?> createRecipe(@RequestBody RecipeRequest request, HttpServletRequest header) {
        // Evita duplicar recetas por título antes de validar el token.
        if (recipeService.recipeExists(request)) {
            return SpringResponse.recipeAlreadyExist();
        }

        // La creación queda asociada al usuario autenticado mediante el JWT.
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);
        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String username = validationResponse.getUsername();
        Optional<UserModel> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
           return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();

        RecipeModel recipe = recipeService.createRecipe(request, user);

        if (recipe != null) {
            return SpringResponse.recipeCreated();
        } else {
            return SpringResponse.errorCreatingRecipe();
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/recipes")
    public ResponseEntity<?> getMyRecipes(HttpServletRequest header) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);
        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String username = validationResponse.getUsername();
        Optional<UserModel> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
           return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();
        List<RecipeModel> listRecipes = recipeService.getMyRecipes(user);
        return ResponseEntity.ok(listRecipes);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/recipes/all")
    public ResponseEntity<?> getAllRecipes() {
        List<RecipeModel> listRecipes = recipeService.getAllRecipes();
        return ResponseEntity.ok(listRecipes);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/recipe/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable("id") Long id) {
        RecipeModel recipe = recipeService.getRecipeById(id);
        if (recipe != null) {
            return ResponseEntity.ok(recipe);
        } else {
            return SpringResponse.recipeNotFound();
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/recipe/{id}")
    public ResponseEntity<?> editMyRecipe(HttpServletRequest header, @RequestBody RecipeRequest request, @PathVariable Long id) {
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
        return recipeService.editMyRecipe(id, user, request);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/recipe/{id}")
    public ResponseEntity<?> deleteMyRecipe(HttpServletRequest header, @PathVariable Long id) {
        // Solo se permite borrar una receta si pertenece al usuario autenticado.
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

        return recipeService.deleteMyRecipe(id, user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/recipe/a/{id}")
    public ResponseEntity<?> deleteRecipeById(@PathVariable Long id) {
        return recipeService.deleteRecipeById(id);
    }
}
