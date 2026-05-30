package com.dishcover.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IRecipeRepository;
import com.dishcover.backend.repositories.IUserRepository;
import com.dishcover.backend.tools.SpringResponse;

@Service
@Transactional
public class FavoriteRecipeService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IRecipeRepository recipeRepository;

    public ResponseEntity<?> saveFavoriteRecipe(Long recipeId, UserModel user) {
        Optional<UserModel> userOptional = userRepository.findById(user.getId());
        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        Optional<RecipeModel> recipeOptional = recipeRepository.findById(recipeId);

        if (recipeOptional.isEmpty()) {
            return SpringResponse.recipeNotFound();
        }

        UserModel managedUser = userOptional.get();
        RecipeModel recipe = recipeOptional.get();
        ensureFavoriteLists(managedUser, recipe);

        Boolean alreadyFavorite = managedUser.getRecipesFavorite().stream().anyMatch(favorite -> favorite.getId().equals(recipeId));
        if (alreadyFavorite) {
            return SpringResponse.favoriteRecipeSaved();
        }

        managedUser.getRecipesFavorite().add(recipe);

        Boolean recipeAlreadyLinksUser = recipe.getUsername().stream().anyMatch(favoriteUser -> favoriteUser.getId().equals(managedUser.getId()));
        if (!recipeAlreadyLinksUser) {
            recipe.getUsername().add(managedUser);
        }

        userRepository.save(managedUser);
        recipeRepository.save(recipe);
        return SpringResponse.favoriteRecipeSaved();

    }

    public ResponseEntity<?> getMyFavoriteRecipes(UserModel user) {
        Optional<UserModel> userOptional = userRepository.findById(user.getId());
        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        UserModel managedUser = userOptional.get();
        if (managedUser.getRecipesFavorite() == null) {
            managedUser.setRecipesFavorite(new ArrayList<>());
        }

        List<Long> favoritesRecipesId = new ArrayList<>();
        managedUser.getRecipesFavorite().forEach( it ->
                {
                    favoritesRecipesId.add(it.getId());
                }
        );
        return ResponseEntity.ok(favoritesRecipesId);
    }

    public ResponseEntity<?> deleteFavoriteRecipe(Long recipeId, UserModel user) {
        Optional<UserModel> userOptional = userRepository.findById(user.getId());
        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        Optional<RecipeModel> recipeOptional = recipeRepository.findById(recipeId);

        if (recipeOptional.isEmpty()) {
            return SpringResponse.recipeNotFound();
        }

        UserModel managedUser = userOptional.get();
        RecipeModel recipe = recipeOptional.get();
        ensureFavoriteLists(managedUser, recipe);

        Boolean removedFromUser = managedUser.getRecipesFavorite().removeIf(favorite -> favorite.getId().equals(recipeId));
        recipe.getUsername().removeIf(favoriteUser -> favoriteUser.getId().equals(managedUser.getId()));

        if (removedFromUser) {
            userRepository.save(managedUser);
            recipeRepository.save(recipe);
        }

        return SpringResponse.favoriteRecipeRemoved();

    }

    private void ensureFavoriteLists(UserModel user, RecipeModel recipe) {
        if (user.getRecipesFavorite() == null) {
            user.setRecipesFavorite(new ArrayList<>());
        }

        if (recipe.getUsername() == null) {
            recipe.setUsername(new ArrayList<>());
        }
    }
    
}
