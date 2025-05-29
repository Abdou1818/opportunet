import { JobSeeker } from './job-seeker.model';

export interface WorkExperience {
  id: number;
  jobTitle: string;
  companyName: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  currentJob?: boolean;
  employmentType?: string;
  jobSeeker: JobSeeker;
  createdAt?: Date;
  updatedAt?: Date;
}