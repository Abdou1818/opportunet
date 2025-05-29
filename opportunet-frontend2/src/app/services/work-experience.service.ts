import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WorkExperience } from '../models/work-experience.model';

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceService {
  private apiUrl = `${environment.apiUrl}/work_experiences`;

  constructor(private http: HttpClient) {}

  getAllWorkExperiences(): Observable<WorkExperience[]> {
    return this.http.get<WorkExperience[]>(this.apiUrl);
  }

  getWorkExperienceById(id: number): Observable<WorkExperience> {
    return this.http.get<WorkExperience>(`${this.apiUrl}/${id}`);
  }

  getWorkExperiencesByJobSeeker(jobSeekerId: number): Observable<WorkExperience[]> {
    return this.http.get<WorkExperience[]>(`${this.apiUrl}/jobseeker/${jobSeekerId}`);
  }

  createWorkExperience(workExperience: WorkExperience): Observable<WorkExperience> {
    return this.http.post<WorkExperience>(this.apiUrl, workExperience);
  }

  updateWorkExperience(id: number, workExperience: WorkExperience): Observable<WorkExperience> {
    return this.http.put<WorkExperience>(`${this.apiUrl}/${id}`, workExperience);
  }

  deleteWorkExperience(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCurrentWorkExperiences(): Observable<WorkExperience[]> {
    return this.http.get<WorkExperience[]>(`${this.apiUrl}/current`);
  }
}