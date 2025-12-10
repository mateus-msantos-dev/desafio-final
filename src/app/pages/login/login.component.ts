import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Ajuste o caminho

@Component({
  selector: 'app-login',
  standalone: true,
  // Certifique-se de que o CommonModule e FormsModule estão importados
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  erro: string | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  login() {
    this.erro = null;
    
    // 1. Tenta fazer o login
    const sucesso = this.authService.login(this.email, this.senha);
    
    if (sucesso) {
      const user = this.authService.getUsuarioLogado();
      
      // 2. Redireciona com base no perfil (role)
      if (user?.role === 'admin') {
        alert(`Login de Admin: ${user.email}. Redirecionando para o painel.`);
        this.router.navigate(['/admin']); 
      } else {
        // Redireciona usuários normais para o Checkout para completar a compra
        this.router.navigate(['/checkout']); 
      }
      
    } else {
      this.erro = 'Email ou senha inválidos. Tente novamente.';
    }
  }
}
