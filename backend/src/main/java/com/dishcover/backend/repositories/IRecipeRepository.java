package com.dishcover.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.UserModel;

import java.util.List;
import java.util.Optional;


@Repository
public interface IRecipeRepository extends JpaRepository<RecipeModel, Long>{
    List<RecipeModel> findByOwnerId(UserModel user);

    Optional<RecipeModel> findByTitle(String title);
}
