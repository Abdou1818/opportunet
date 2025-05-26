package com.opportunet.opportunet_backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.opportunet.opportunet_backend.Entities.Recruiter;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
}