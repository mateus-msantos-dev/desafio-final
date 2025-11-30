import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Simulando banco local
  usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

  usuarioLogado: any = null;

  constructor() {}

  salvarBD() {
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }

  cadastrarUsuario(novo: any) {
    const existe = this.usuarios.find((u: any) => u.email === novo.email);

    if (existe) return false;

    this.usuarios.push(novo);
    this.salvarBD();
    return true;
  }

  login(email: string, senha: string) {
    const user = this.usuarios.find((u: any) => u.email === email && u.senha === senha);

    if (!user) return false;

    this.usuarioLogado = user;
    return true;
  }

  logout() {
    this.usuarioLogado = null;
  }

  isLogado() {
    return this.usuarioLogado !== null;
  }
}
