package com.opportunet.opportunet_backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.opportunet.opportunet_backend.Entities.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
}