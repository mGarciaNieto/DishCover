package com.dishcover.backend.tools;

// Autor: Manuel García Nieto
// Carga datos iniciales para que el entorno académico sea reproducible.

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.dishcover.backend.models.CategoryModel;
import com.dishcover.backend.models.EventCategoryModel;
import com.dishcover.backend.models.EventModel;
import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.RoleModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.ICategoryRepository;
import com.dishcover.backend.repositories.IEventCategoryRepository;
import com.dishcover.backend.repositories.IEventRepository;
import com.dishcover.backend.repositories.IRecipeRepository;
import com.dishcover.backend.repositories.IUserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class DataInitializer {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IRecipeRepository recipeRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

    @Autowired
    private IEventCategoryRepository eventCategoryRepository;

    @Autowired
    private IEventRepository eventRepository;
    
    @Autowired
    private ResourceLoader resourceLoader;

    @PostConstruct
    public void initializer() throws IOException {
        // Usuarios de demostración para probar login y roles desde la primera ejecución.
        if (userRepository.count() == 0){
            UserModel admin = new UserModel();
            admin.setUsername("Manuel");
            admin.setPassword(passwordEncoder.encode("root"));
            admin.setEmail("manuel.garcia@dishcover.local");
            admin.setFirstName("Manuel");
            admin.setLastName("García Nieto");
            admin.setRole(RoleModel.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);

            UserModel user = new UserModel();
            user.setUsername("demo");
            user.setPassword(passwordEncoder.encode("1234"));
            user.setEmail("demo@dishcover.local");
            user.setFirstName("Usuario");
            user.setLastName("Demo");
            user.setRole(RoleModel.USER);
            user.setActive(true);
            userRepository.save(user);
        }

        if (categoryRepository.count() == 0) {
            String[] categories = {"Vegano", "Vegetariano", "Carne", "Pescado", "Pasta", "Pizza", "Ensalada", "Postre", "Bebidas", "Desayuno", "Sopa"};
            for (String categoryName : categories) {
                CategoryModel category = new CategoryModel();
                category.setCategory(categoryName);
                categoryRepository.save(category);
            }
        }

        if(recipeRepository.count()==0) {
            // Las recetas base se importan desde JSON para evitar una base de datos vacía.
            InputStream inputStream = resourceLoader.getResource("classpath:recetas.json").getInputStream();

            ObjectMapper mapper = new ObjectMapper();

            List<RecipeModel> recipes = Arrays.asList(mapper.readValue(inputStream, RecipeModel[].class));
            recipeRepository.saveAll(recipes);
        }

        if (eventCategoryRepository.count() == 0) {
            String[] categories = {"Recetas mediterráneas", "Recetas asiáticas", "Recetas americanas", "Recetas europeas", "Recetas para fiestas", 
                "Recetas de temporada", "Cenas románticas", "Brunch", "Comida para llevar", "Comida étnica", "Street food"};
            for (String categoryName : categories) {
                EventCategoryModel category = new EventCategoryModel();
                category.setCategory(categoryName);
                eventCategoryRepository.save(category);
            }
        }

        // Los eventos base se sincronizan por título para mantener fechas y textos actualizados.
        InputStream inputStream = resourceLoader.getResource("classpath:eventos.json").getInputStream();

        ObjectMapper mapper = new ObjectMapper();

        List<EventModel> events = Arrays.asList(mapper.readValue(inputStream, EventModel[].class));
        for (EventModel event : events) {
            event.setEventCategory(resolveEventCategory(event));

            eventRepository.findByTitle(event.getTitle()).ifPresentOrElse(existingEvent -> {
                existingEvent.setDate(event.getDate());
                existingEvent.setDuration(event.getDuration());
                existingEvent.setDescription(event.getDescription());
                existingEvent.setEventCategory(event.getEventCategory());
                existingEvent.setImageUrl(event.getImageUrl());
                eventRepository.save(existingEvent);
            }, () -> eventRepository.save(event));
        }

    }

    private EventCategoryModel resolveEventCategory(EventModel event) {
        if (event.getEventCategory() == null || event.getEventCategory().getCategory() == null) {
            return event.getEventCategory();
        }

        return eventCategoryRepository.findByCategory(event.getEventCategory().getCategory())
            .orElse(event.getEventCategory());
    }
}
