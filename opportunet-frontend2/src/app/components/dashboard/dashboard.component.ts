import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { JobSeeker } from '../../models/job-seeker.model';
import { Job } from '../../models/job.model';
import { Application } from '../../models/application.model';
import { ApplicationStatus } from '../../models/enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: JobSeeker | null = null;
  recentJobs: Job[] = [];
  recentApplications: Application[] = [];
  loading = true;
  
  stats = {
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user?.id) {
          this.loadUserApplications(user.id);
        }
      });
  }

  private loadDashboardData(): void {
    this.jobService.getAllJobs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (jobs) => {
          this.recentJobs = jobs.slice(0, 5);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des emplois:', error);
          this.loading = false;
        }
      });
  }

  private loadUserApplications(userId: number): void {
    this.applicationService.getApplicationsByJobSeeker(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applications) => {
          this.recentApplications = applications.slice(0, 5);
          this.calculateStats(applications);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des candidatures:', error);
        }
      });
  }

  private calculateStats(applications: Application[]): void {
    this.stats.totalApplications = applications.length;
    this.stats.pendingApplications = applications.filter(app => app.status === ApplicationStatus.PENDING).length;
    this.stats.acceptedApplications = applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length;
    this.stats.rejectedApplications = applications.filter(app => app.status === ApplicationStatus.REJECTED).length;
  }

  getStatusClass(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.PENDING: return 'status-pending';
      case ApplicationStatus.REVIEWED: return 'status-reviewed';
      case ApplicationStatus.ACCEPTED: return 'status-accepted';
      case ApplicationStatus.REJECTED: return 'status-rejected';
      default: return '';
    }
  }

  getStatusText(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.PENDING: return 'En attente';
      case ApplicationStatus.REVIEWED: return 'Examinée';
      case ApplicationStatus.ACCEPTED: return 'Acceptée';
      case ApplicationStatus.REJECTED: return 'Refusée';
      default: return status;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  get welcomeMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 17) return 'Bon après-midi';
    return 'Bonsoir';
  }
}