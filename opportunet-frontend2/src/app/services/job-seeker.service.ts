import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobSeeker } from '../models/job-seeker.model';

@Injectable({
  providedIn: 'root'
})
export class JobSeekerService {
  private apiUrl = `${environment.apiUrl}/job_seekers`;

  constructor(private http: HttpClient) {}

  getAllJobSeekers(): Observable<JobSeeker[]> {
    return this.http.get<JobSeeker[]>(this.apiUrl);
  }

  getJobSeekerById(id: number): Observable<JobSeeker> {
    return this.http.get<JobSeeker>(`${this.apiUrl}/${id}`);
  }

  createJobSeeker(jobSeeker: JobSeeker): Observable<JobSeeker> {
    return this.http.post<JobSeeker>(this.apiUrl, jobSeeker);
  }

  updateJobSeeker(id: number, jobSeeker: JobSeeker): Observable<JobSeeker> {
    return this.http.put<JobSeeker>(`${this.apiUrl}/${id}`, jobSeeker);
  }

  deleteJobSeeker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}