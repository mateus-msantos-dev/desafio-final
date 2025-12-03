import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private router: Router, private authService: AuthService) {}

  goTo(path: string) {
    this.router.navigate([`/admin/${path}`]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}