package com.dishcover.backend.services;

// Autor: Manuel García Nieto
// Servicio de negocio para eventos e inscripciones de usuarios.

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.dishcover.backend.dto.request.EventRequest;
import com.dishcover.backend.models.EventCategoryModel;
import com.dishcover.backend.models.EventModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IEventCategoryRepository;
import com.dishcover.backend.repositories.IEventRepository;
import com.dishcover.backend.repositories.IUserRepository;
import com.dishcover.backend.tools.SpringResponse;

@Service
public class EventService {

    @Autowired
    private IEventRepository eventRepository;
    
    @Autowired
    private IEventCategoryRepository eventCategoryRepository;

    @Autowired
    private IUserRepository userRepository;

    public EventModel createEvent(EventRequest request) {
        // La categoría del evento se recupera de la tabla inicializada en la base de datos.
        Optional<EventCategoryModel> categoryOptional = eventCategoryRepository.findByCategory(request.getEventCategory());
        EventCategoryModel category = categoryOptional.get();
        
        EventModel event = new EventModel();
        event.setDate(request.getDate());
        event.setDescription(request.getDescription());
        event.setDuration(request.getDuration());
        event.setEventCategory(category);
        event.setImageUrl(request.getImageUrl());
        event.setTitle(request.getTitle());

        return eventRepository.save(event);

    }

    public List<EventModel> getAllEvents() {
        return eventRepository.findAll();
    }

    public EventModel getEventById(Long id) {
        Optional<EventModel> eventOptional = eventRepository.findById(id);

        if (!eventOptional.isPresent()) {
            return null;
        }

        return eventOptional.get();
    }

    public ResponseEntity<?> editEventById(long id, EventRequest request) {
        Optional<EventModel> eventOptional = eventRepository.findById(id);
        if (!eventOptional.isPresent()) {
            return SpringResponse.eventNotFound();
        }

        Optional<EventCategoryModel> categoryOptional = eventCategoryRepository.findByCategory(request.getEventCategory());
        EventCategoryModel category = categoryOptional.get();

        EventModel event = eventOptional.get();
        
        try {
            event.setDate(request.getDate());
            event.setDescription(request.getDescription());
            event.setDuration(request.getDuration());
            event.setEventCategory(category);
            event.setImageUrl(request.getImageUrl());
            event.setTitle(request.getTitle());

            eventRepository.save(event);
            return SpringResponse.eventUpdated();
        } catch (Exception ex) {
            return SpringResponse.errorUpdatingEvent();
        }
    }

    public ResponseEntity<?> deleteEventById(Long id) {
        Optional<EventModel> eventOptional = eventRepository.findById(id);
        if (!eventOptional.isPresent()) {
            return SpringResponse.eventNotFound();
        }

        EventModel event = eventOptional.get();
        
        try{
            eventRepository.delete(event);
            return SpringResponse.eventDeleted();
        } catch (Exception ex) {
            return SpringResponse.errorDeletingEvent();
        }
    }

    public ResponseEntity<?> registerUserToEvent(Long eventId, UserModel user) {
        // Relación ManyToMany: se actualiza tanto el usuario como el evento.
        Optional<EventModel> eventOptional = eventRepository.findById(eventId);

        if (eventOptional.isEmpty()) {
            return SpringResponse.eventNotFound();
        }

        EventModel event = eventOptional.get();

        if (!user.getEvents().contains(event)) {
            user.getEvents().add(event);
            event.getAttendee().add(user);

            userRepository.save(user);
            eventRepository.save(event);
            return SpringResponse.userRegisteredToEvent();
        } else {
            return SpringResponse.userAlreadyRegisteredToEvent();
        }
    }

    public ResponseEntity<?> getEventsRegistered(UserModel user) {
        List<Long> eventsRegisteredId = new ArrayList<>();
        user.getEvents().forEach( it ->
            {
                eventsRegisteredId.add(it.getId());
            }
        );
        return ResponseEntity.ok(eventsRegisteredId);
    }

    public ResponseEntity<?> unregisterUserToEvent(Long eventId, UserModel user) {
        Optional<EventModel> eventOptional = eventRepository.findById(eventId);

        if (eventOptional.isEmpty()) {
            return SpringResponse.eventNotFound();
        }

        EventModel event = eventOptional.get();

        if (user.getEvents().contains(event)) {
            user.getEvents().remove(event);
            event.getAttendee().remove(user);

            userRepository.save(user);
            eventRepository.save(event);
            return SpringResponse.userUnregisteredToEvent();
        } else {
            return SpringResponse.userNotRegisteredToEvent();
        }
    }

    public Boolean eventExists(EventRequest request) {
        Optional<EventModel> checkEvent = eventRepository.findByTitle(request.getTitle());
        if (checkEvent.isPresent()) {
            return true;
        } else {
            return false;
        }
    }
    
}
