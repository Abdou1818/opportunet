package com.opportunet.opportunet_backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.opportunet.opportunet_backend.Entities.Job;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByTitleContaining(String keyword);
}