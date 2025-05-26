package com.opportunet.opportunet_backend.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "work_experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;
    private String description;

    @ManyToOne
    @JoinColumn(name = "job_seeker_id", nullable = false)
    private JobSeeker jobSeeker;
}