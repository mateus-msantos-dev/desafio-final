import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  // Variáveis vinculadas ao ngModel no template
  nome: string = '';
  email: string = '';
  telefone: string = '';
  senha: string = '';
  senha2: string = '';
  
  // ⬅️ NOVO: Variável de controle do consentimento LGPD
  consentimentoLGPD: boolean = false; 

  erro: string | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  cadastrar() {
    this.erro = null; // Limpa erros anteriores

    // 1. Validação de senhas
    if (this.senha !== this.senha2) {
      this.erro = 'As senhas digitadas não coincidem. Por favor, verifique.';
      return;
    }
    
    // 2. Validação do Consentimento LGPD (Embora o HTML já faça o required)
    if (!this.consentimentoLGPD) {
        this.erro = 'Você deve concordar com a LGPD para realizar o cadastro.';
        return;
    }
    
    // 3. Cria o objeto do novo usuário
    const novoUsuario = {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      senha: this.senha, 
      role: 'user' 
    };

    // 4. Tenta cadastrar o usuário usando o serviço
    // Nota: Verifique se o método no seu AuthService é `cadastrarUsuario` ou `cadastrar`
    const sucesso = this.authService.cadastrarUsuario(novoUsuario);

    if (sucesso) {
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      
      // 5. Redireciona para a página de login
      this.router.navigate(['/login']);
      
    } else {
      // Falha no cadastro (e-mail já existe)
      this.erro = 'Este e-mail já está cadastrado. Tente fazer login.';
    }
  }
}