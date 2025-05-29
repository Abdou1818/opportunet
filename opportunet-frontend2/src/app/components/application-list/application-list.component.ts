import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { Application } from '../../models/application.model';
import { JobSeeker } from '../../models/job-seeker.model';
import { ApplicationStatus } from '../../models/enum';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit, OnDestroy {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  currentUser: JobSeeker | null = null;
  loading = true;
  selectedStatus: ApplicationStatus | '' = '';

  // Statuts pour le filtre
  applicationStatuses = Object.values(ApplicationStatus);

  private destroy$ = new Subject<void>();

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
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
        if (user?.id) {
          this.loadApplications(user.id);
        }
      });
  }

  private loadApplications(userId: number): void {
    this.loading = true;
    this.applicationService.getApplicationsByJobSeeker(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applications) => {
          this.applications = applications.sort((a, b) => 
            new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
          );
          this.filteredApplications = this.applications;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des candidatures:', error);
          this.loading = false;
        }
      });
  }

  filterByStatus(status: ApplicationStatus | ''): void {
    this.selectedStatus = status;
    if (status === '') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(app => app.status === status);
    }
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

  getStatusCount(status: ApplicationStatus): number {
    return this.applications.filter(app => app.status === status).length;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  get totalApplications(): number {
    return this.applications.length;
  }

  get pendingApplications(): number {
    return this.getStatusCount(ApplicationStatus.PENDING);
  }

  get acceptedApplications(): number {
    return this.getStatusCount(ApplicationStatus.ACCEPTED);
  }

  get rejectedApplications(): number {
    return this.getStatusCount(ApplicationStatus.REJECTED);
  }
}