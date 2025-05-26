package com.opportunet.opportunet_backend.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.opportunet.opportunet_backend.Entities.JobSeeker;

@Repository
public interface JobSeekerRepository extends JpaRepository<JobSeeker, Long> {
    Optional<JobSeeker> findByEmail(String email);
}