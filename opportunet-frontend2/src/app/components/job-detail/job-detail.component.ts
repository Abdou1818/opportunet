import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { Job } from '../../models/job.model';
import { Application } from '../../models/application.model';
import { JobSeeker } from '../../models/job-seeker.model';
import { ApplicationStatus, JobType, ExperienceLevel } from '../../models/enum';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit, OnDestroy {
  job: Job | null = null;
  currentUser: JobSeeker | null = null;
  loading = true;
  applying = false;
  hasApplied = false;
  applicationStatus: ApplicationStatus | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadJob();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  private loadJob(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (jobId) {
      this.jobService.getJobById(jobId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (job) => {
            this.job = job;
            this.checkApplicationStatus();
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement de l\'emploi:', error);
            this.loading = false;
            this.router.navigate(['/jobs']);
          }
        });
    }
  }

  private checkApplicationStatus(): void {
    if (this.currentUser?.id && this.job?.id) {
      this.applicationService.getApplicationsByJobSeeker(this.currentUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (applications) => {
            const existingApplication = applications.find(app => app.job.id === this.job?.id);
            if (existingApplication) {
              this.hasApplied = true;
              this.applicationStatus = existingApplication.status;
            }
          },
          error: (error) => {
            console.error('Erreur lors de la vérification des candidatures:', error);
          }
        });
    }
  }

  applyToJob(): void {
    if (!this.currentUser || !this.job || this.hasApplied) {
      return;
    }

    this.applying = true;

    const application: Application = {
      id: 0,
      job: this.job,
      jobSeeker: this.currentUser,
      status: ApplicationStatus.PENDING,
      applicationDate: new Date(),
      createdAt: new Date()
    };

    this.applicationService.createApplication(application)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.applying = false;
          this.hasApplied = true;
          this.applicationStatus = ApplicationStatus.PENDING;
          // Afficher un message de succès
        },
        error: (error) => {
          this.applying = false;
          console.error('Erreur lors de la candidature:', error);
          // Afficher un message d'erreur
        }
      });
  }

  getJobTypeLabel(jobType: JobType): string {
    switch (jobType) {
      case JobType.FULL_TIME: return 'Temps plein';
      case JobType.PART_TIME: return 'Temps partiel';
      case JobType.FREELANCE: return 'Freelance';
      case JobType.INTERNSHIP: return 'Stage';
      default: return jobType;
    }
  }

  getExperienceLevelLabel(level: ExperienceLevel): string {
    switch (level) {
      case ExperienceLevel.JUNIOR: return 'Junior (0-2 ans)';
      case ExperienceLevel.MID: return 'Confirmé (2-5 ans)';
      case ExperienceLevel.SENIOR: return 'Senior (5+ ans)';
      default: return level;
    }
  }

  getApplicationStatusText(): string {
    switch (this.applicationStatus) {
      case ApplicationStatus.PENDING: return 'Candidature en attente';
      case ApplicationStatus.REVIEWED: return 'Candidature examinée';
      case ApplicationStatus.ACCEPTED: return 'Candidature acceptée';
      case ApplicationStatus.REJECTED: return 'Candidature refusée';
      default: return 'Candidature envoyée';
    }
  }

  formatSalary(): string {
    if (!this.job) return '';
    
    if (this.job.salaryMin && this.job.salaryMax) {
      return `${this.job.salaryMin.toLocaleString()} - ${this.job.salaryMax.toLocaleString()} €`;
    } else if (this.job.salary) {
      return `${this.job.salary.toLocaleString()} €`;
    }
    return 'Salaire à négocier';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}
