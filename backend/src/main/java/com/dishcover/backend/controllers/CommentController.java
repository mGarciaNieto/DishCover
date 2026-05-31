package com.dishcover.backend.controllers;

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

import com.dishcover.backend.dto.request.CommentRequest;
import com.dishcover.backend.dto.response.ValidationResponse;
import com.dishcover.backend.models.CommentModel;
import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IUserRepository;
import com.dishcover.backend.security.JwtService;
import com.dishcover.backend.services.CommentService;
import com.dishcover.backend.services.RecipeService;
import com.dishcover.backend.tools.SpringResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private JwtService jwtService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/recipe/{id}/comment")
    public ResponseEntity<?> addComment(HttpServletRequest header, @PathVariable Long id, @RequestBody CommentRequest request) {
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

        RecipeModel recipe = recipeService.getRecipeById(id);

        CommentModel comment = commentService.createComment(request, user, recipe);

        if (comment != null) {
            return ResponseEntity.ok(comment);
        } else {
            return SpringResponse.errorCommentNotCreated();
        }
    }
    
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/recipe/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        RecipeModel recipe = recipeService.getRecipeById(id);
        List<CommentModel> comments = commentService.getComments(recipe);

        if (comments != null) {
            return ResponseEntity.ok(comments);
        } else {
            return SpringResponse.commentsNotFound();
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/comment/{id}")
    public ResponseEntity<?> editMyComment(HttpServletRequest header, @RequestBody CommentRequest request, @PathVariable Long id) {
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
        return commentService.editMyComment(id, user, request);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/comment/{id}")
    public ResponseEntity<?> deleteMyComment(HttpServletRequest header, @PathVariable Long id) {
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

        return commentService.deleteMyComment(id, user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/comment/a/{id}")
    public ResponseEntity<?> deleteCommentById(@PathVariable Long id) {
        return commentService.deleteCommentById(id);
    }
}
