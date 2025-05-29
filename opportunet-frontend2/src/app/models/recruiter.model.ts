
import { Job } from './job.model';
import { User } from './user.model';
import { Company } from './company.model';
export interface Recruiter extends User {
  position?: string;
  industry?: string;
  companySize?: number;
  active?: boolean;
  company: Company;
  jobs?: Job[];
}