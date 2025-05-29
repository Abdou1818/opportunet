// src/app/components/job-list/job-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JobService } from '../../services/job.service';
import { CompanyService } from '../../services/company.service';
import { Job } from '../../models/job.model';
import { Company } from '../../models/company.model';
import { JobType, ExperienceLevel } from '../../models/enum';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  companies: Company[] = [];
  loading = true;
  searchForm: FormGroup;
  showFilters = false;

  // Enums pour les templates
  jobTypes = Object.values(JobType);
  experienceLevels = Object.values(ExperienceLevel);

  // Filtres
  filters = {
    keyword: '',
    jobType: '',
    experienceLevel: '',
    location: '',
    companyId: null as number | null
  };

  private destroy$ = new Subject<void>();

  constructor(
    private jobService: JobService,
    private companyService: CompanyService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      keyword: [''],
      jobType: [''],
      experienceLevel: [''],
      location: [''],
      company: ['']
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.loadCompanies();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadJobs(): void {
    this.loading = true;
    this.jobService.getAllJobs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (jobs) => {
          this.jobs = jobs;
          this.filteredJobs = jobs;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des emplois:', error);
          this.loading = false;
        }
      });
  }

  private loadCompanies(): void {
    this.companyService.getAllCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des entreprises:', error);
        }
      });
  }

  private setupSearch(): void {
    // Recherche en temps réel
    this.searchForm.get('keyword')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(keyword => {
        this.filters.keyword = keyword;
        this.applyFilters();
      });

    // Autres filtres
    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(formValue => {
        this.filters = {
          keyword: formValue.keyword || '',
          jobType: formValue.jobType || '',
          experienceLevel: formValue.experienceLevel || '',
          location: formValue.location || '',
          companyId: formValue.company || null
        };
        this.applyFilters();
      });
  }

  private applyFilters(): void {
    this.filteredJobs = this.jobs.filter(job => {
      // Recherche par mot-clé
      if (this.filters.keyword) {
        const keyword = this.filters.keyword.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(keyword);
        const matchDescription = job.description.toLowerCase().includes(keyword);
        const matchCompany = job.company.name.toLowerCase().includes(keyword);
        if (!matchTitle && !matchDescription && !matchCompany) {
          return false;
        }
      }

      // Filtre par type d'emploi
      if (this.filters.jobType && job.jobType !== this.filters.jobType) {
        return false;
      }

      // Filtre par niveau d'expérience
      if (this.filters.experienceLevel && job.experienceLevel !== this.filters.experienceLevel) {
        return false;
      }

      // Filtre par localisation
      if (this.filters.location) {
        const location = this.filters.location.toLowerCase();
        if (!job.location?.toLowerCase().includes(location)) {
          return false;
        }
      }

      // Filtre par entreprise
      if (this.filters.companyId && job.company.id !== this.filters.companyId) {
        return false;
      }

      return true;
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.filters = {
      keyword: '',
      jobType: '',
      experienceLevel: '',
      location: '',
      companyId: null
    };
    this.filteredJobs = this.jobs;
  }

  getJobTypeLabel(jobType: JobType): string {
    switch (jobType) {
      case JobType.FULL_TIME:
        return 'Temps plein';
      case JobType.PART_TIME:
        return 'Temps partiel';
      case JobType.FREELANCE:
        return 'Freelance';
      case JobType.INTERNSHIP:
        return 'Stage';
      default:
        return jobType;
    }
  }

  getExperienceLevelLabel(level: ExperienceLevel): string {
    switch (level) {
      case ExperienceLevel.JUNIOR:
        return 'Junior (0-2 ans)';
      case ExperienceLevel.MID:
        return 'Confirmé (2-5 ans)';
      case ExperienceLevel.SENIOR:
        return 'Senior (5+ ans)';
      default:
        return level;
    }
  }

  formatSalary(job: Job): string {
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} €`;
    } else if (job.salary) {
      return `${job.salary.toLocaleString()} €`;
    }
    return 'Salaire non spécifié';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  get resultsCount(): number {
    return this.filteredJobs.length;
  }

  get hasActiveFilters(): boolean {
    return !!(this.filters.keyword || this.filters.jobType || 
              this.filters.experienceLevel || this.filters.location || 
              this.filters.companyId);
  }
}