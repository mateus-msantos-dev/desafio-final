import { Routes } from '@angular/router';
import { SobreComponent } from './pages/sobre/sobre.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  
  { path: 'sobre', component: SobreComponent},

];
