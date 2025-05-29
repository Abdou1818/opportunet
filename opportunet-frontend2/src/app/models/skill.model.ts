import { JobSeeker } from './job-seeker.model';

export interface Skill {
  id: number;
  name: string;
  category: string;
  description?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  jobSeekers?: JobSeeker[];
}