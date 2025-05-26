package com.opportunet.opportunet_backend.Controllers;

import com.opportunet.opportunet_backend.Entities.Recruiter;
import com.opportunet.opportunet_backend.Services.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiters")
public class RecruiterController {
    @Autowired
    private RecruiterService recruiterService;

    @GetMapping
    public List<Recruiter> getAllRecruiters() {
        return recruiterService.getAllRecruiters();
    }

    @PostMapping
    public Recruiter createRecruiter(@RequestBody Recruiter recruiter) {
        return recruiterService.createRecruiter(recruiter);
    }
}