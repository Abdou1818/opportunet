// src/app/components/profile/profile.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { JobSeekerService } from '../../services/job-seeker.service';
import { SkillService } from '../../services/skill.service';
import { WorkExperienceService } from '../../services/work-experience.service';
import { JobSeeker } from '../../models/job-seeker.model';
import { Skill } from '../../models/skill.model';
import { WorkExperience } from '../../models/work-experience.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: JobSeeker | null = null;
  profileForm: FormGroup;
  skillForm: FormGroup;
  experienceForm: FormGroup;
  
  skills: Skill[] = [];
  workExperiences: WorkExperience[] = [];
  allSkills: Skill[] = [];
  
  loading = true;
  saving = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  
  showSkillForm = false;
  showExperienceForm = false;
  editingExperience: WorkExperience | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private jobSeekerService: JobSeekerService,
    private skillService: SkillService,
    private workExperienceService: WorkExperienceService
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      profileSummary: [''],
      experience: [0]
    });

    this.skillForm = this.formBuilder.group({
      skillId: ['', Validators.required]
    });

    this.experienceForm = this.formBuilder.group({
      id: [0],
      jobTitle: ['', Validators.required],
      companyName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      currentJob: [false],
      location: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAllSkills();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.populateForm(user);
          this.loadUserData(user.id);
        }
        this.loading = false;
      });
  }

  private populateForm(user: JobSeeker): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      location: user.location,
      profileSummary: user.profileSummary,
      experience: user.experience
    });
  }

  private loadUserData(userId: number): void {
    // Charger les compétences
    this.skillService.getSkillsByJobSeeker(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (skills) => {
          this.skills = skills;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des compétences:', error);
        }
      });

    // Charger les expériences
    this.workExperienceService.getWorkExperiencesByJobSeeker(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (experiences) => {
          this.workExperiences = experiences.sort((a, b) => 
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        },
        error: (error) => {
          console.error('Erreur lors du chargement des expériences:', error);
        }
      });
  }

  private loadAllSkills(): void {
    this.skillService.getAllSkills()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (skills) => {
          this.allSkills = skills;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des compétences:', error);
        }
      });
  }

  onSubmitProfile(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.saving = true;
      this.message = '';

      const updatedUser = {
        ...this.currentUser,
        ...this.profileForm.value
      };

      this.jobSeekerService.updateJobSeeker(this.currentUser.id, updatedUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.saving = false;
            this.message = 'Profil mis à jour avec succès !';
            this.messageType = 'success';
            setTimeout(() => this.message = '', 5000);
          },
          error: (error) => {
            this.saving = false;
            this.message = 'Erreur lors de la mise à jour du profil';
            this.messageType = 'error';
            console.error('Erreur:', error);
          }
        });
    }
  }

  onSubmitSkill(): void {
    if (this.skillForm.valid && this.currentUser) {
      const skillId = Number(this.skillForm.value.skillId);
      
      this.skillService.assignSkillToJobSeeker(skillId, this.currentUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUserData(this.currentUser!.id);
            this.skillForm.reset();
            this.showSkillForm = false;
            this.message = 'Compétence ajoutée avec succès !';
            this.messageType = 'success';
            setTimeout(() => this.message = '', 3000);
          },
          error: (error) => {
            this.message = 'Erreur lors de l\'ajout de la compétence';
            this.messageType = 'error';
            console.error('Erreur:', error);
          }
        });
    }
  }

  onSubmitExperience(): void {
    if (this.experienceForm.valid && this.currentUser) {
      const experienceData: WorkExperience = {
        ...this.experienceForm.value,
        jobSeeker: this.currentUser,
        startDate: new Date(this.experienceForm.value.startDate),
        endDate: this.experienceForm.value.endDate ? new Date(this.experienceForm.value.endDate) : undefined
      };

      const request = this.editingExperience 
        ? this.workExperienceService.updateWorkExperience(this.editingExperience.id, experienceData)
        : this.workExperienceService.createWorkExperience(experienceData);

      request.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUserData(this.currentUser!.id);
            this.experienceForm.reset();
            this.showExperienceForm = false;
            this.editingExperience = null;
            this.message = this.editingExperience ? 'Expérience mise à jour !' : 'Expérience ajoutée !';
            this.messageType = 'success';
            setTimeout(() => this.message = '', 3000);
          },
          error: (error) => {
            this.message = 'Erreur lors de la sauvegarde de l\'expérience';
            this.messageType = 'error';
            console.error('Erreur:', error);
          }
        });
    }
  }

  removeSkill(skillId: number): void {
    if (this.currentUser && confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      this.skillService.unassignSkillFromJobSeeker(skillId, this.currentUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUserData(this.currentUser!.id);
            this.message = 'Compétence supprimée';
            this.messageType = 'success';
            setTimeout(() => this.message = '', 3000);
          },
          error: (error) => {
            this.message = 'Erreur lors de la suppression';
            this.messageType = 'error';
            console.error('Erreur:', error);
          }
        });
    }
  }

  editExperience(experience: WorkExperience): void {
    this.editingExperience = experience;
    this.experienceForm.patchValue({
      id: experience.id,
      jobTitle: experience.jobTitle,
      companyName: experience.companyName,
      startDate: this.formatDateForInput(experience.startDate),
      endDate: experience.endDate ? this.formatDateForInput(experience.endDate) : '',
      currentJob: experience.currentJob,
      location: experience.location,
      description: experience.description
    });
    this.showExperienceForm = true;
  }

  deleteExperience(experienceId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) {
      this.workExperienceService.deleteWorkExperience(experienceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUserData(this.currentUser!.id);
            this.message = 'Expérience supprimée';
            this.messageType = 'success';
            setTimeout(() => this.message = '', 3000);
          },
          error: (error) => {
            this.message = 'Erreur lors de la suppression';
            this.messageType = 'error';
            console.error('Erreur:', error);
          }
        });
    }
  }

  toggleSkillForm(): void {
    this.showSkillForm = !this.showSkillForm;
    if (this.showSkillForm) {
      this.skillForm.reset();
    }
  }

  toggleExperienceForm(): void {
    this.showExperienceForm = !this.showExperienceForm;
    if (this.showExperienceForm && !this.editingExperience) {
      this.experienceForm.reset();
      this.experienceForm.patchValue({ id: 0, currentJob: false });
    }
    if (!this.showExperienceForm) {
      this.editingExperience = null;
    }
  }

  onCurrentJobChange(): void {
    const isCurrentJob = this.experienceForm.get('currentJob')?.value;
    const endDateControl = this.experienceForm.get('endDate');
    
    if (isCurrentJob) {
      endDateControl?.setValue('');
      endDateControl?.disable();
    } else {
      endDateControl?.enable();
    }
  }

  formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  }

  getAvailableSkills(): Skill[] {
    const userSkillIds = this.skills.map(skill => skill.id);
    return this.allSkills.filter(skill => !userSkillIds.includes(skill.id));
  }

  get profileFormControls() {
    return this.profileForm.controls;
  }

  get skillFormControls() {
    return this.skillForm.controls;
  }

  get experienceFormControls() {
    return this.experienceForm.controls;
  }
}