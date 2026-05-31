package com.dishcover.backend.controllers;

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

import com.dishcover.backend.dto.request.ReportRequest;
import com.dishcover.backend.dto.response.ValidationResponse;
import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.ReportModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IUserRepository;
import com.dishcover.backend.security.JwtService;
import com.dishcover.backend.services.RecipeService;
import com.dishcover.backend.services.ReportService;
import com.dishcover.backend.tools.SpringResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class ReportController {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private ReportService reportService;

    @Autowired
    private JwtService jwtService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/recipe/{id}/report")
    public ResponseEntity<?> addReport(HttpServletRequest header, @PathVariable Long id, @RequestBody ReportRequest request) {
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

        RecipeModel recipe = recipeService.getRecipeById(id);

        ReportModel report = reportService.createReport(request, user, recipe);

        if (report != null) {
            return ResponseEntity.ok(report);
        } else {
            return SpringResponse.errorReportNotCreated();
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/recipe/{id}/reports")
    public ResponseEntity<?> getReports(@PathVariable Long id) {
        RecipeModel recipe = recipeService.getRecipeById(id);
        List<ReportModel> reports = reportService.getReports(recipe);

        if (reports != null) {
            return ResponseEntity.ok(reports);
        } else {
            return SpringResponse.reportsNotFound();
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/report/{id}")
    public ResponseEntity<?> editMyReport(HttpServletRequest header, @RequestBody ReportRequest request, @PathVariable Long id) {
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
        return reportService.editMyReport(id, user, request);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/report/{id}")
    public ResponseEntity<?> deleteMyReport(HttpServletRequest header, @PathVariable Long id) {
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

        return reportService.deleteMyReport(id, user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/report/a/{id}")
    public ResponseEntity<?> deleteReportById(@PathVariable Long id) {
        return reportService.deleteReportById(id);
    }
}
