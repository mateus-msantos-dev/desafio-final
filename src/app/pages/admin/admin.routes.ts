import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { authGuard } from '../../guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],  // protege TODAS as rotas filhas
    children: [
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./pages/admin-pedidos/admin-pedidos.component')
            .then(m => m.AdminPedidosComponent)
      },
      {
        path: 'criar-produto',
        loadComponent: () =>
          import('./pages/criar-produto/criar-produto.component')
            .then(m => m.CriarProdutoComponent)
      },
      {
        path: 'produtos',
        loadComponent: () =>
          import('./pages/listar-produtos/listar-produtos.component')
            .then(m => m.ListarProdutosComponent)
      }
    ]
  }
];