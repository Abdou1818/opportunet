
import { Recruiter } from './recruiter.model';
import { Application } from './application.model';

import { ExperienceLevel } from './enum';
import { Company } from './company.model';
import { JobType } from './enum';


export interface Job {
  id: number;
  title: string;
  description: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salary?: number;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  isActive?: boolean;
  company: Company;
  recruiter: Recruiter;
  applications?: Application[];
  createdAt?: Date;
  updatedAt?: Date;
}