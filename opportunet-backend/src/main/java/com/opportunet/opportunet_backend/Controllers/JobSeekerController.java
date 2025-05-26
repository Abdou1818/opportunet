package com.opportunet.opportunet_backend.Controllers;

import com.opportunet.opportunet_backend.Entities.JobSeeker;
import com.opportunet.opportunet_backend.Services.JobSeekerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job_seekers")
public class JobSeekerController {
    @Autowired
    private JobSeekerService jobSeekerService;

    @GetMapping
    public List<JobSeeker> getAllJobSeekers() {
        return jobSeekerService.getAllJobSeekers();
    }

    @PostMapping
    public JobSeeker createJobSeeker(@RequestBody JobSeeker jobSeeker) {
        return jobSeekerService.createJobSeeker(jobSeeker);
    }
}