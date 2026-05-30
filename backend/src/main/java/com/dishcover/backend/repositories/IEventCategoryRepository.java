package com.dishcover.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dishcover.backend.models.EventCategoryModel;

@Repository
public interface IEventCategoryRepository extends JpaRepository<EventCategoryModel, Long> {

    @Query("SELECT c FROM EventCategoryModel c WHERE c.category = :categoryName")
    Optional<EventCategoryModel> findByCategory(String categoryName);

}
