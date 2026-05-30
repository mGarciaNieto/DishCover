package com.dishcover.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.dishcover.backend.dto.request.CommentRequest;
import com.dishcover.backend.models.CommentModel;
import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.ICommentRepository;
import com.dishcover.backend.tools.SpringResponse;

@Service
public class CommentService {
    @Autowired
    private ICommentRepository commentRepository;

    public CommentModel createComment(CommentRequest request, UserModel user, RecipeModel recipe) {
        CommentModel newComment = new CommentModel();
        newComment.setAuthor(user.getUsername());
        newComment.setComment(request.getComment());
        newComment.setRecipe(recipe);
        newComment.setUser(user);

        CommentModel commentSaved = commentRepository.save(newComment);

        return commentSaved;
    }

    public List<CommentModel> getComments(RecipeModel recipe) {
        List<CommentModel> comments;
        comments = commentRepository.findByRecipe(recipe);
        return comments;
    }

    public ResponseEntity<?> editMyComment(Long commentId, UserModel user, CommentRequest request ){
        Optional<CommentModel> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()){
            return SpringResponse.commentNotFound();
        }

        CommentModel comment = commentOptional.get();
        if (!comment.getAuthor().equals(user.getUsername())) {
            return SpringResponse.notAuthorComment();
        }

        try {
            comment.setComment(request.getComment());

            commentRepository.save(comment);
            return SpringResponse.commentUpdated();
        } catch (Exception ex) {
            return SpringResponse.errorUpdatingComment();
        }

    }

    public ResponseEntity<?> deleteMyComment(Long commentId, UserModel user) {
        Optional<CommentModel> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()){
            return SpringResponse.commentNotFound();
        }

        CommentModel comment = commentOptional.get();
        if (comment.getUser() != user) {
            return SpringResponse.notAuthorComment();
        } else {
            try {
                commentRepository.delete(comment);
                return SpringResponse.commentDeleted();
            } catch (Exception ex) {
                return SpringResponse.errorDeletingComment();
            }   
        }  
    }

    public ResponseEntity<?> deleteCommentById(Long commentId) {
        Optional<CommentModel> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()){
            return SpringResponse.commentNotFound();
        }

        CommentModel comment = commentOptional.get();
        
        try {
            commentRepository.delete(comment);
            return SpringResponse.commentDeleted();
        } catch (Exception ex) {
            return SpringResponse.errorDeletingComment();
        }
    }
    
}