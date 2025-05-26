package com.opportunet.opportunet_backend.Services;

import com.opportunet.opportunet_backend.Entities.Recruiter;
import com.opportunet.opportunet_backend.Repositories.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecruiterService {
    @Autowired
    private RecruiterRepository recruiterRepository;

    public List<Recruiter> getAllRecruiters() {
        return recruiterRepository.findAll();
    }

    public Recruiter createRecruiter(Recruiter recruiter) {
        return recruiterRepository.save(recruiter);
    }
}