import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'OpportuneT';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté au démarrage
    if (this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe({
        error: (error) => {
          // Token invalide, déconnecter l'utilisateur
          console.error('Token invalide:', error);
          this.authService.logout();
        }
      });
    }
  }
}