package com.dishcover.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dishcover.backend.models.EventModel;

@Repository
public interface IEventRepository extends JpaRepository<EventModel, Long> {
    Optional<EventModel> findByTitle(String title);
}