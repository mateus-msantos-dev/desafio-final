import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ⬅️ Ajuste o caminho conforme necessário

/**
 * Guarda de Rota para verificar se o usuário está autenticado (logado).
 * Se não estiver, redireciona para a página de login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  // Injeta os serviços necessários (AuthService e Router)
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verifica o estado de autenticação
  if (authService.isAuthenticated()) {
    return true; // Acesso concedido
  } else {
    // 2. Acesso negado
    alert('Você precisa fazer login para acessar esta página.');
    
    // 3. Redireciona o usuário para a rota de login
    return router.createUrlTree(['/login']); 
  }
};