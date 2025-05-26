package com.opportunet.opportunet_backend.Controllers;

import com.opportunet.opportunet_backend.Entities.WorkExperience;
import com.opportunet.opportunet_backend.Services.WorkExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work_experiences")
public class WorkExperienceController {
    @Autowired
    private WorkExperienceService workExperienceService;

    @GetMapping
    public List<WorkExperience> getAllWorkExperiences() {
        return workExperienceService.getAllWorkExperiences();
    }

    @PostMapping
    public WorkExperience createWorkExperience(@RequestBody WorkExperience workExperience) {
        return workExperienceService.createWorkExperience(workExperience);
    }
}