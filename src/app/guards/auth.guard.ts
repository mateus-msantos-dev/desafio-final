import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // OK: Usuário logado
  } else {
    // ⬅️ Lógica de BLOQUEIO: Alerta e Redireciona
    alert('Você precisa fazer login para finalizar a compra.'); 
    return router.createUrlTree(['/login']); 
  }
};