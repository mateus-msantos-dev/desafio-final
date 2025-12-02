import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const usuario = authService.getUsuarioLogado();

  // Verifica se o usuário está logado E se o role é 'admin'
  if (usuario && usuario.role === 'admin') {
    return true; // Acesso concedido
  } else {
    // Acesso negado, redireciona para a home ou para a página de login
    alert('Acesso negado: Você não tem permissão de administrador.');
    return router.createUrlTree(['/login']); 
  }
};