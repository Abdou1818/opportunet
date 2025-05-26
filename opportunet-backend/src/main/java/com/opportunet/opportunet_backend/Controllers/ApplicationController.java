package com.opportunet.opportunet_backend.Controllers;

import com.opportunet.opportunet_backend.Entities.Application;
import com.opportunet.opportunet_backend.Entities.ApplicationStatus;
import com.opportunet.opportunet_backend.Services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    @Autowired
    private ApplicationService applicationService;

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @PostMapping
    public Application createApplication(@RequestBody Application application) {
        return applicationService.createApplication(application);
    }

    @PatchMapping("/{id}/status")
    public void updateApplicationStatus(@PathVariable Long id, @RequestParam ApplicationStatus status) {
        applicationService.updateApplicationStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
    }
}