import { Routes } from '@angular/router';
import { SobreComponent } from './pages/sobre/sobre.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { MeuPerfilComponent } from './pages/meu-perfil/meu-perfil.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { CartComponent } from './pages/cart/cart.component';
import { adminGuard } from './guards/admin.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { authGuard } from './guards/auth.guard';
import { LgpdComponent } from './pages/lgpd/lgpd.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  
  { path: 'sobre', component: SobreComponent},

  { path: 'login', component: LoginComponent },

  { path: 'cadastro', component: CadastroComponent },

  { path: 'meu-perfil', component: MeuPerfilComponent },

  { path: 'produtos', component: ProdutosComponent },

  { path: 'carrinho', component: CartComponent},

  { path: 'termos-e-condicoes', component: LgpdComponent },

  {
  path: 'admin',
  loadChildren: () =>
    import('./pages/admin/admin.routes')
      .then(r => r.adminRoutes)
  },

  { 
      path: 'checkout', 
      component: CheckoutComponent, 
      canActivate: [authGuard] 
    }
  
];
