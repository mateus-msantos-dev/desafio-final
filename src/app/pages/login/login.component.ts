import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  senha = '';
  erro = '';

  constructor(private router: Router) {}

  login() {
    // LOGIN PROVISÓRIO APENAS PARA TESTE
    if (this.email === 'admin@admin.com' && this.senha === '123456') {
      this.router.navigate(['/admin']);
    } else {
      this.erro = 'Credenciais inválidas';
    }
  }
}
