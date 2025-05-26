package com.opportunet.opportunet_backend.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "job_seekers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobSeeker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String password;

    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Application> applications;

    @ManyToMany
    @JoinTable(name = "job_seeker_skills", joinColumns = @JoinColumn(name = "job_seeker_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private List<Skill> skills;

    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkExperience> workExperiences;
}