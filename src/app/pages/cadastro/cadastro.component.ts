import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {

  nome = '';
  email = '';
  telefone = '';
  senha = '';
  senha2 = '';
  erro = '';

  constructor(private auth: AuthService, private router: Router) {}

  cadastrar() {
    this.erro = '';

    if (this.senha !== this.senha2) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    const ok = this.auth.cadastrarUsuario({
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      senha: this.senha
    });

    if (!ok) {
      this.erro = 'Email já cadastrado.';
      return;
    }

    // Redireciona para login
    this.router.navigate(['/login']);
  }
}