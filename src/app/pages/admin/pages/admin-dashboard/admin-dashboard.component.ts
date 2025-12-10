import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Remova RouterOutlet daqui, não é necessário no dashboard
import { AuthService } from '../../../../services/auth.service'; // Verifique se o caminho está correto para o seu projeto

@Component({
  selector: 'app-admin-dashboard', // Mude o seletor para não conflitar
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
// AQUI ESTAVA O ERRO: Mude de AdminComponent para AdminDashboardComponent
export class AdminDashboardComponent { 

  constructor(private router: Router, private authService: AuthService) {}

  goTo(path: string) {
    this.router.navigate([`/admin/${path}`]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}