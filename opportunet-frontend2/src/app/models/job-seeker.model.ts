import { Skill } from "./skill.model";
import { User } from "./user.model";
import { WorkExperience } from "./work-experience.model";
import { Application } from "./application.model";

export interface JobSeeker extends User {
  resume?: string;
  profileSummary?: string;
  experience?: number;
  active?: boolean;
  skills?: Skill[];
  workExperiences?: WorkExperience[];
  applications?: Application[];
}