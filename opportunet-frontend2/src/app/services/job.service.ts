import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Job } from '../models/job.model';
import { JobType, ExperienceLevel } from '../models/enum';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  searchJobs(keyword: string): Observable<Job[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Job[]>(`${this.apiUrl}/search`, { params });
  }

  createJob(job: Job): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  createJobWithEnums(
    title: string,
    description: string,
    jobType: JobType,
    experienceLevel: ExperienceLevel,
    companyId: number,
    recruiterId: number
  ): Observable<Job> {
    const params = new HttpParams()
      .set('title', title)
      .set('description', description)
      .set('jobType', jobType)
      .set('experienceLevel', experienceLevel)
      .set('companyId', companyId.toString())
      .set('recruiterId', recruiterId.toString());
    
    return this.http.post<Job>(`${this.apiUrl}/create`, null, { params });
  }

  updateJob(id: number, job: Job): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getJobsByCompany(companyId: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}?companyId=${companyId}`);
  }

  getJobsByRecruiter(recruiterId: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}?recruiterId=${recruiterId}`);
  }
}