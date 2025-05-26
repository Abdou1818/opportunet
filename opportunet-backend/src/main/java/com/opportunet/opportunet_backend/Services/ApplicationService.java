package com.opportunet.opportunet_backend.Services;

import com.opportunet.opportunet_backend.Entities.Application;
import com.opportunet.opportunet_backend.Entities.ApplicationStatus;
import com.opportunet.opportunet_backend.Repositories.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {
    @Autowired
    private ApplicationRepository applicationRepository;

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    public Application createApplication(Application application) {
        return applicationRepository.save(application);
    }

    public void updateApplicationStatus(Long id, ApplicationStatus status) {
        Optional<Application> application = applicationRepository.findById(id);
        application.ifPresent(app -> {
            app.setStatus(status);
            applicationRepository.save(app);
        });
    }

    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}