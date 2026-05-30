package com.dishcover.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dishcover.backend.models.RecipeModel;
import com.dishcover.backend.models.ReportModel;
import java.util.List;


@Repository
public interface IReportRepository extends JpaRepository<ReportModel, Long> {
    List<ReportModel> findByRecipe(RecipeModel recipe);
}
