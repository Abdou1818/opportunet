package com.opportunet.opportunet_backend.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recruiters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recruiter {
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

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}