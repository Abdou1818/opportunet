import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Skill } from '../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = `${environment.apiUrl}/skills`;

  constructor(private http: HttpClient) {}

  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }

  getSkillById(id: number): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/${id}`);
  }

  searchSkills(keyword: string): Observable<Skill[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Skill[]>(`${this.apiUrl}/search`, { params });
  }

  getSkillsByJobSeeker(jobSeekerId: number): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/jobseeker/${jobSeekerId}`);
  }

  createSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(this.apiUrl, skill);
  }

  updateSkill(id: number, skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.apiUrl}/${id}`, skill);
  }

  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignSkillToJobSeeker(skillId: number, jobSeekerId: number): Observable<void> {
    const params = new HttpParams()
      .set('skillId', skillId.toString())
      .set('jobSeekerId', jobSeekerId.toString());
    return this.http.post<void>(`${this.apiUrl}/assign`, null, { params });
  }

  unassignSkillFromJobSeeker(skillId: number, jobSeekerId: number): Observable<void> {
    const params = new HttpParams()
      .set('skillId', skillId.toString())
      .set('jobSeekerId', jobSeekerId.toString());
    return this.http.delete<void>(`${this.apiUrl}/unassign`, { params });
  }
}