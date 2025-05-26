package com.opportunet.opportunet_backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.opportunet.opportunet_backend.Entities.Application;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
}