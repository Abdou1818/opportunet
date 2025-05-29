import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'jobs', 
    loadComponent: () => import('./components/job-list/job-list.component').then(m => m.JobListComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'jobs/:id', 
    loadComponent: () => import('./components/job-detail/job-detail.component').then(m => m.JobDetailComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'applications', 
    loadComponent: () => import('./components/application-list/application-list.component').then(m => m.ApplicationListComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/dashboard' }
];