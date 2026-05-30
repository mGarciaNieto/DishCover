package com.dishcover.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IRecipeRepository;
import com.dishcover.backend.repositories.IUserRepository;

/**
 * Pruebas unitarias del servicio de recetas favoritas.
 * Verifica que la relación entre usuario y receta se gestione desde entidades administradas por JPA.
 *
 * @author Manuel García Nieto
 */
@ExtendWith(MockitoExtension.class)
class FavoriteRecipeServiceTests {

    @Mock
    private IUserRepository userRepository;

    @Mock
    private IRecipeRepository recipeRepository;

    @InjectMocks
    private FavoriteRecipeService favoriteRecipeService;

    @Test
    void saveFavoriteRecipeAddsRecipeToManagedUser() {
        UserModel detachedUser = createUser(1L);
        UserModel managedUser = createUser(1L);
        RecipeModel recipe = createRecipe(7L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(managedUser));
        when(recipeRepository.findById(7L)).thenReturn(Optional.of(recipe));

        ResponseEntity<?> response = favoriteRecipeService.saveFavoriteRecipe(7L, detachedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(managedUser.getRecipesFavorite().contains(recipe));
        assertTrue(recipe.getUsername().contains(managedUser));
        verify(userRepository).save(managedUser);
        verify(recipeRepository).save(recipe);
    }

    @Test
    @SuppressWarnings("unchecked")
    void getMyFavoriteRecipesReturnsOnlyManagedUserFavoriteIds() {
        UserModel detachedUser = createUser(1L);
        UserModel managedUser = createUser(1L);
        RecipeModel recipe = createRecipe(7L);
        managedUser.getRecipesFavorite().add(recipe);

        when(userRepository.findById(1L)).thenReturn(Optional.of(managedUser));

        ResponseEntity<?> response = favoriteRecipeService.getMyFavoriteRecipes(detachedUser);
        List<Long> favoriteIds = (List<Long>) response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(List.of(7L), favoriteIds);
    }

    @Test
    void deleteFavoriteRecipeRemovesRelationFromBothSides() {
        UserModel detachedUser = createUser(1L);
        UserModel managedUser = createUser(1L);
        RecipeModel recipe = createRecipe(7L);
        managedUser.getRecipesFavorite().add(recipe);
        recipe.getUsername().add(managedUser);

        when(userRepository.findById(1L)).thenReturn(Optional.of(managedUser));
        when(recipeRepository.findById(7L)).thenReturn(Optional.of(recipe));

        ResponseEntity<?> response = favoriteRecipeService.deleteFavoriteRecipe(7L, detachedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(managedUser.getRecipesFavorite().isEmpty());
        assertTrue(recipe.getUsername().isEmpty());
        verify(userRepository).save(managedUser);
        verify(recipeRepository).save(recipe);
    }

    private UserModel createUser(Long id) {
        UserModel user = new UserModel();
        user.setId(id);
        user.setRecipesFavorite(new ArrayList<>());
        return user;
    }

    private RecipeModel createRecipe(Long id) {
        RecipeModel recipe = new RecipeModel();
        recipe.setId(id);
        recipe.setUsername(new ArrayList<>());
        return recipe;
    }
}
