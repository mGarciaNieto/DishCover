package com.dishcover.backend.services;

// Autor: Manuel García Nieto
// Servicio de negocio para crear, editar, consultar y eliminar recetas.

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dishcover.backend.dto.request.RecipeRequest;
import com.dishcover.backend.models.CategoryModel;
import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.ICategoryRepository;
import com.dishcover.backend.repositories.ICommentRepository;
import com.dishcover.backend.repositories.IRecipeRepository;
import com.dishcover.backend.repositories.IReportRepository;
import com.dishcover.backend.tools.SpringResponse;

@Service
@Transactional
public class RecipeService {
    @Autowired
    private IRecipeRepository recipeRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

    @Autowired
    private ICommentRepository commentRepository;

    @Autowired
    private IReportRepository reportRepository;

    public RecipeModel createRecipe(RecipeRequest request, UserModel user) {
        // La categoría llega como texto desde el frontend y se resuelve contra la tabla de categorías.
        Optional<CategoryModel> categoryOptional = categoryRepository.findByCategory(request.getRecipeCategory());
        CategoryModel category = categoryOptional.get();

        RecipeModel newRecipe = new RecipeModel();
        newRecipe.setTitle(request.getTitle());
        newRecipe.setImageUrl(request.getImageUrl());
        newRecipe.setDescription(request.getDescription());
        newRecipe.setCookingTime(request.getCookingTime());
        newRecipe.setNumPersons(request.getNumPersons());
        newRecipe.setIngredients(request.getIngredients());
        newRecipe.setOwnerId(user);
        newRecipe.setRecipeCategory(category);

        return recipeRepository.save(newRecipe);
    }

    public List<RecipeModel> getMyRecipes(UserModel user) {
       return recipeRepository.findByOwnerId(user);
    }

    public List<RecipeModel> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public RecipeModel getRecipeById(Long id) {

        Optional<RecipeModel> recipeOptional = recipeRepository.findById(id);

        if(!recipeOptional.isPresent())
            return null;

        return recipeOptional.get();
    }

    public ResponseEntity<?> editMyRecipe(Long recipeId, UserModel user, RecipeRequest request) {
        Optional<RecipeModel> recipeOptional = recipeRepository.findById(recipeId);
        if (!recipeOptional.isPresent()){
            return SpringResponse.recipeNotFound();
        }

        RecipeModel recipe = recipeOptional.get();
        if (recipe.getOwnerId() == null || !recipe.getOwnerId().getId().equals(user.getId())) {
            return SpringResponse.notOwnerRecipe();
        }

        Optional<CategoryModel> categoryOptional = categoryRepository.findByCategory(request.getRecipeCategory());
        CategoryModel category = categoryOptional.get();

        try {
            recipe.setTitle(request.getTitle());
            recipe.setDescription(request.getDescription());
            recipe.setCookingTime(request.getCookingTime());
            recipe.setImageUrl(recipe.getImageUrl());
            recipe.setNumPersons(request.getNumPersons());
            recipe.setIngredients(request.getIngredients());
            recipe.setRecipeCategory(category);
    
            recipeRepository.save(recipe);
            return SpringResponse.recipeUpdated();
        } catch (Exception ex) {
            return SpringResponse.errorUpdatingRecipe();
        }
    }

    public ResponseEntity<?> deleteMyRecipe(Long recipeId, UserModel user) {
        Optional<RecipeModel> recipeOptional = recipeRepository.findById(recipeId);
        if (!recipeOptional.isPresent()){
            return SpringResponse.recipeNotFound();
        }

        RecipeModel recipe = recipeOptional.get();
        if (recipe.getOwnerId() == null || !recipe.getOwnerId().getId().equals(user.getId())) {
            return SpringResponse.notOwnerRecipe();
        } else {
            try {
                unlinkRecipeRelations(recipe);
                recipeRepository.delete(recipe);
                return SpringResponse.recipeDeleted();
            } catch (Exception ex) {
                return SpringResponse.errorDeletingRecipe();
            }   
        }  
    }

    public ResponseEntity<?> deleteRecipeById(Long recipeId) {
        Optional<RecipeModel> recipeOptional = recipeRepository.findById(recipeId);
        if (!recipeOptional.isPresent()){
            return SpringResponse.recipeNotFound();
        }

        RecipeModel recipe = recipeOptional.get();
        
        try {
            unlinkRecipeRelations(recipe);
            recipeRepository.delete(recipe);
            return SpringResponse.recipeDeleted();
        } catch (Exception ex) {
            return SpringResponse.errorDeletingRecipe();
        }   
    }

    public Boolean recipeExists(RecipeRequest request) {
        Optional<RecipeModel> checkRecipe = recipeRepository.findByTitle(request.getTitle());
        if (checkRecipe.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    private void unlinkRecipeRelations(RecipeModel recipe) {
        // Antes de eliminar una receta se limpian comentarios, reportes y favoritos asociados.
        commentRepository.deleteAll(commentRepository.findByRecipe(recipe));
        reportRepository.deleteAll(reportRepository.findByRecipe(recipe));

        if (recipe.getUsername() != null) {
            recipe.getUsername().forEach(user -> {
                if (user.getRecipesFavorite() != null) {
                    user.getRecipesFavorite().removeIf(favorite -> favorite.getId().equals(recipe.getId()));
                }
            });
            recipe.getUsername().clear();
        }
    }
}
