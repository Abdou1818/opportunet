package com.opportunet.opportunet_backend.Services;

import com.opportunet.opportunet_backend.Entities.JobSeeker;
import com.opportunet.opportunet_backend.Repositories.JobSeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobSeekerService {
    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    public List<JobSeeker> getAllJobSeekers() {
        return jobSeekerRepository.findAll();
    }

    public Optional<JobSeeker> getJobSeekerById(Long id) {
        return jobSeekerRepository.findById(id);
    }

    public JobSeeker createJobSeeker(JobSeeker jobSeeker) {
        return jobSeekerRepository.save(jobSeeker);
    }

    public void deleteJobSeeker(Long id) {
        jobSeekerRepository.deleteById(id);
    }
}