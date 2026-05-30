package com.dishcover.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dishcover.backend.models.CommentModel;
import com.dishcover.backend.models.RecipeModel;

@Repository
public interface ICommentRepository extends JpaRepository<CommentModel, Long> {
    List<CommentModel> findByRecipe(RecipeModel recipe);

}
