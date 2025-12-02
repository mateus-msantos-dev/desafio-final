import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interface para simular a estrutura do usuário
interface User {
  email: string;
  senha: string;
  // Adiciona a simulação de nível de acesso (role)
  role: 'user' | 'admin'; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject para o estado de login (Reatividade)
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  // Armazena o usuário logado atualmente (ou null)
  private usuarioLogado: User | null = null; 
  
  // Simula o banco de dados (BD) local
  private usuarios: User[] = JSON.parse(localStorage.getItem('usuarios') || '[]');

  constructor() {
    // 1. Tenta carregar o usuário logado da sessão ao iniciar
    const sessionUser = sessionStorage.getItem('usuarioLogado');
    if (sessionUser) {
        this.usuarioLogado = JSON.parse(sessionUser);
        this.loggedInSubject.next(true); // Notifica que o usuário está logado
    }
    
    // 2. Configuração inicial de usuários se o BD estiver vazio
    if (this.usuarios.length === 0) {
        // Usuários padrão para teste
        this.cadastrarUsuario({ email: 'admin@doce.com', senha: '123', role: 'admin' });
        this.cadastrarUsuario({ email: 'user@doce.com', senha: '123', role: 'user' });
    }
  }
  
  private salvarBD() {
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }
  
  cadastrarUsuario(novo: any): boolean {
    const existe = this.usuarios.find((u: any) => u.email === novo.email);
    if (existe) return false;

    this.usuarios.push(novo);
    this.salvarBD();
    return true;
  }

  // Novo login: usa o BehaviorSubject e o role
  login(email: string, senha: string): boolean {
    const user = this.usuarios.find((u: any) => u.email === email && u.senha === senha);

    if (!user) return false;

    this.usuarioLogado = user;
    sessionStorage.setItem('usuarioLogado', JSON.stringify(user)); // Persiste a sessão
    this.loggedInSubject.next(true); // ⬅️ ATUALIZA O ESTADO (Header e Guards)
    return true;
  }

  logout(): void {
    this.usuarioLogado = null;
    sessionStorage.removeItem('usuarioLogado');
    this.loggedInSubject.next(false); // ⬅️ ATUALIZA O ESTADO (Header e Guards)
  }

  // Usado pelo AuthGuard
  isAuthenticated(): boolean {
    return this.usuarioLogado !== null;
  }
  
  // ⬅️ Implementação correta da função que retorna o objeto completo
  getUsuarioLogado(): User | null {
      return this.usuarioLogado;
  }
}
