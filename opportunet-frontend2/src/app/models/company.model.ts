import { Recruiter } from "./recruiter.model";
import { Job } from "./job.model";

export interface Company {
  id: number;
  name: string;
  location: string;
  description?: string;
  website?: string;
  industry?: string;
  companySize?: number;
  foundedYear?: number;
  createdAt?: Date;
  updatedAt?: Date;
  recruiters?: Recruiter[];
  jobs?: Job[];
}