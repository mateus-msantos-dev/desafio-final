import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Adicionar RouterLink para o link "Já tenho conta"
import { AuthService } from '../../services/auth.service'; // Ajuste o caminho

@Component({
  selector: 'app-cadastro',
  standalone: true,
  // ⬅️ Importar FormsModule, CommonModule e RouterLink
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
    
    // 2. Cria o objeto do novo usuário
    const novoUsuario = {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      senha: this.senha, // NOTE: Em um sistema real, a senha seria criptografada aqui
      role: 'user' // Define como usuário comum por padrão
    };

    // 3. Tenta cadastrar o usuário usando o serviço
    const sucesso = this.authService.cadastrarUsuario(novoUsuario);

    if (sucesso) {
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      
      // 4. Redireciona para a página de login
      this.router.navigate(['/login']);
      
    } else {
      // Falha no cadastro (e-mail já existe)
      this.erro = 'Este e-mail já está cadastrado. Tente fazer login.';
    }
  }
}