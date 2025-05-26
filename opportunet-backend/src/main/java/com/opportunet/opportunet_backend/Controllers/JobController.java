package com.opportunet.opportunet_backend.Controllers;

import com.opportunet.opportunet_backend.Entities.Job;
import com.opportunet.opportunet_backend.Entities.JobType;
import com.opportunet.opportunet_backend.Entities.ExperienceLevel;
import com.opportunet.opportunet_backend.Services.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private JobService jobService;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/search")
    public List<Job> searchJobs(@RequestParam String keyword) {
        return jobService.searchJobs(keyword);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        Job savedJob = jobService.createJob(job);
        return ResponseEntity.ok(savedJob);
    }

    @PostMapping("/create")
    public ResponseEntity<Job> createJobWithEnums(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam JobType jobType,
            @RequestParam ExperienceLevel experienceLevel,
            @RequestParam Long companyId,
            @RequestParam Long recruiterId) {

        Job job = jobService.createJobWithEnums(title, description, jobType, experienceLevel, companyId, recruiterId);
        return ResponseEntity.ok(job);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}