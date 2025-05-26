package com.opportunet.opportunet_backend.Services;

import com.opportunet.opportunet_backend.Entities.WorkExperience;
import com.opportunet.opportunet_backend.Repositories.WorkExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkExperienceService {
    @Autowired
    private WorkExperienceRepository workExperienceRepository;

    public List<WorkExperience> getAllWorkExperiences() {
        return workExperienceRepository.findAll();
    }

    public WorkExperience createWorkExperience(WorkExperience workExperience) {
        return workExperienceRepository.save(workExperience);
    }

    public void deleteWorkExperience(Long id) {
        workExperienceRepository.deleteById(id);
    }
}