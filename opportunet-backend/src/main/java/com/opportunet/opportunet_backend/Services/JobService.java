package com.opportunet.opportunet_backend.Services;

import com.opportunet.opportunet_backend.Entities.Company;
import com.opportunet.opportunet_backend.Entities.Job;
import com.opportunet.opportunet_backend.Entities.Recruiter;
import com.opportunet.opportunet_backend.Entities.JobType;
import com.opportunet.opportunet_backend.Entities.ExperienceLevel;
import com.opportunet.opportunet_backend.Repositories.CompanyRepository;
import com.opportunet.opportunet_backend.Repositories.JobRepository;
import com.opportunet.opportunet_backend.Repositories.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public List<Job> searchJobs(String keyword) {
        return jobRepository.findByTitleContaining(keyword);
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public Job createJobWithEnums(String title, String description, JobType jobType, ExperienceLevel experienceLevel,
            Long companyId, Long recruiterId) {
        Optional<Company> company = companyRepository.findById(companyId);
        Optional<Recruiter> recruiter = recruiterRepository.findById(recruiterId);

        if (company.isPresent() && recruiter.isPresent()) {
            Job job = new Job();
            job.setTitle(title);
            job.setDescription(description);
            job.setJobType(jobType);
            job.setExperienceLevel(experienceLevel);
            job.setCompany(company.get());
            job.setRecruiter(recruiter.get());

            return jobRepository.save(job);
        }
        throw new IllegalArgumentException("Company or Recruiter not found");
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}