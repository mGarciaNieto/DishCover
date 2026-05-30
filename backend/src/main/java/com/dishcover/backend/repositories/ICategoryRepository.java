package com.dishcover.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dishcover.backend.models.CategoryModel;

@Repository
public interface ICategoryRepository extends JpaRepository<CategoryModel, Long>{
    
    @Query("SELECT c FROM CategoryModel c WHERE c.category = :categoryName")
    Optional<CategoryModel> findByCategory(String categoryName);
    
}