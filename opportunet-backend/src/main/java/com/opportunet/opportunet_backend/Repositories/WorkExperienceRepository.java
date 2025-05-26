package com.opportunet.opportunet_backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.opportunet.opportunet_backend.Entities.WorkExperience;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
}