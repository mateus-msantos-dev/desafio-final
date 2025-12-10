import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

// Importe o componente PAI (o Shell) que acabamos de criar no Passo 2
import { AdminComponent } from './admin.component'; 

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent, // Carrega o pai (que tem o <router-outlet>)
    canActivate: [adminGuard],
    children: [
      {
        path: '', // Quando acessar /admin, carrega o Dashboard dentro do pai
        loadComponent: () => 
          import('./pages/admin-dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent) // Agora ele vai encontrar esse nome!
      },
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
      },
      {
        path: 'produtos/editar/:id',
        loadComponent: () =>
          import('./pages/criar-produto/criar-produto.component')
            .then(m => m.CriarProdutoComponent)
      }
    ]
  }
];