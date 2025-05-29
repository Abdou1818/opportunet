import { JobSeeker } from './job-seeker.model';
import { Job } from './job.model';
import { ApplicationStatus } from './enum';

export interface Application {
  id: number;
  job: Job;
  jobSeeker: JobSeeker;
  status: ApplicationStatus;
  applicationDate: Date;
  createdAt: Date;
  updatedAt?: Date;
}