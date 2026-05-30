package com.dishcover.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.dishcover.backend.dto.request.ReportRequest;
import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.ReportModel;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IReportRepository;
import com.dishcover.backend.tools.SpringResponse;

@Service
public class ReportService {
    @Autowired
    private IReportRepository reportRepository;

     public ReportModel createReport(ReportRequest request, UserModel user, RecipeModel recipe) {
        ReportModel newReport = new ReportModel();
        newReport.setReport(request.getReport());
        newReport.setRecipe(recipe);
        newReport.setUser(user);

        ReportModel reportSaved = reportRepository.save(newReport);

        return reportSaved;
    }

    public List<ReportModel> getReports(RecipeModel recipe) {
        List<ReportModel> reports;
        reports = reportRepository.findByRecipe(recipe);
        return reports;
    }

     public ResponseEntity<?> editMyReport(Long reportId, UserModel user, ReportRequest request ){
        Optional<ReportModel> reportOptional = reportRepository.findById(reportId);
        if (!reportOptional.isPresent()){
            return SpringResponse.reportNotFound();
        }

        ReportModel report = reportOptional.get();
        if (report.getUser() != user) {
            return SpringResponse.notOwnerReport();
        }

        try {
            report.setReport(request.getReport());

            reportRepository.save(report);
            return SpringResponse.reportUpdated();
        } catch (Exception ex) {
            return SpringResponse.errorUpdatingReport();
        }
    }

    public ResponseEntity<?> deleteMyReport(Long reportId, UserModel user) {
        Optional<ReportModel> reportOptional = reportRepository.findById(reportId);
        if (!reportOptional.isPresent()){
            return SpringResponse.reportNotFound();
        }

        ReportModel report = reportOptional.get();
        if (report.getUser() != user) {
            return SpringResponse.notOwnerReport();
        } else {
            try {
                reportRepository.delete(report);
                return SpringResponse.reportDeleted();
            } catch (Exception ex) {
                return SpringResponse.errorDeletingReport();
            }   
        }  
    }

    public ResponseEntity<?> deleteReportById(Long reportId) {
        Optional<ReportModel> reportOptional = reportRepository.findById(reportId);
        if (!reportOptional.isPresent()){
            return SpringResponse.reportNotFound();
        }

        ReportModel report = reportOptional.get();
        
        try {
            reportRepository.delete(report);
            return SpringResponse.reportDeleted();
        } catch (Exception ex) {
            return SpringResponse.errorDeletingReport();
        }
    }
}