package com.dishcover.backend.controllers;

// Autor: Manuel García Nieto
// Controlador REST para consultar eventos y gestionar inscripciones de usuarios.

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dishcover.backend.dto.request.EventRequest;
import com.dishcover.backend.dto.response.ValidationResponse;
import com.dishcover.backend.models.EventModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IUserRepository;
import com.dishcover.backend.security.JwtService;
import com.dishcover.backend.services.EventService;
import com.dishcover.backend.tools.SpringResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private IUserRepository userRepository;
    
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')")
    @PostMapping("/event/create")
    public ResponseEntity<?> createEvent(@RequestBody EventRequest request) {
        if (eventService.eventExists(request)) {
            return SpringResponse.eventAlreadyExist();
        }

        EventModel event = eventService.createEvent(request);

        if (event != null){
            return SpringResponse.eventCreated();
        } else {
            return SpringResponse.errorCreatingEvent();
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'GESTOR')")
    @GetMapping("/event/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        EventModel event = eventService.getEventById(id);
        if (event != null) {
            return ResponseEntity.ok(event);
        } else {
            return SpringResponse.eventNotFound();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')")
    @GetMapping("/event/{id}/attendees")
    public ResponseEntity<?> getAttendeesFromEvent(@PathVariable Long id) {
        EventModel event = eventService.getEventById(id);
        if (event != null) {
            List<UserModel> attendees = event.getAttendee();
            return ResponseEntity.ok(attendees);
        } else {
            return SpringResponse.eventNotFound();
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'GESTOR')")
    @GetMapping("/event/all")
    public ResponseEntity<?> getAllEvents() {
        // Devuelve el catálogo completo de eventos disponible para el frontend.
        List<EventModel> listEvents = eventService.getAllEvents();

        if (listEvents != null) {
            return ResponseEntity.ok(listEvents);
        } else {
            return SpringResponse.eventsNotFound();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')")
    @PutMapping("/event/{id}")
    public ResponseEntity<?> editEventByid(@PathVariable Long id, @RequestBody EventRequest request) {
        return eventService.editEventById(id, request);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')")
    @DeleteMapping("/event/{id}")
    public ResponseEntity<?> deleteEventById(@PathVariable Long id) {
        return eventService.deleteEventById(id);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'GESTOR')")
    @PostMapping("/event/{id}/register")
    public ResponseEntity<?> registerUserToEvent(@PathVariable Long id, HttpServletRequest header) {
        // El token identifica el usuario que se va a inscribir al evento.
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);
        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String userName = validationResponse.getUsername();
        Optional<UserModel> userOptional = userRepository.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();

        ResponseEntity<?> response;

        try {
            response = eventService.registerUserToEvent(id, user);
        } catch (Exception e) {
            response = SpringResponse.errorRegisteringUserToEvent();
        }
        return response;
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'GESTOR')")
    @GetMapping("/events/registered")
    public ResponseEntity<?> getEventsRegisteredOfUser(HttpServletRequest header) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);
        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String userName = validationResponse.getUsername();
        Optional<UserModel> userOptional = userRepository.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();

        ResponseEntity<?> response;

        try {
            response = eventService.getEventsRegistered(user);
        } catch (Exception ex) {
            response = SpringResponse.errorGettingEventsRegistered();
        }
        return response;
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'GESTOR')")
    @DeleteMapping("/event/{id}/unregister")
    public ResponseEntity<?> unregisterUserToEvent(@PathVariable Long id, HttpServletRequest header) {
        ValidationResponse validationResponse = jwtService.validateTokenAndUser(header);
        if (!validationResponse.isValid()) {
            return SpringResponse.invalidToken();
        }

        String userName = validationResponse.getUsername();
        Optional<UserModel> userOptional = userRepository.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return SpringResponse.userNotFound();
        }

        UserModel user = userOptional.get();

        ResponseEntity<?> response;

        try {
            response = eventService.unregisterUserToEvent(id, user);
        } catch (Exception e) {
            response = SpringResponse.errorUnregisteringUserToEvent();
        }
        return response;
    }
}
