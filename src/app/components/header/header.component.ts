import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuAberto = false;
  cartItemCount: number = 0;
  isUserLoggedIn: boolean = false;
  
  private cartSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Contador do Carrinho
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(
      (count) => {
        this.cartItemCount = count;
      }
    );
    
    // 2. Estado de Login
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.isUserLoggedIn = isLoggedIn;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
    if (this.authSubscription) this.authSubscription.unsubscribe();
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  // --- LÓGICA NOVA DE REDIRECIONAMENTO ---
  navegarParaPerfil() {
    const usuario = this.authService.getUsuarioLogado();

    if (!usuario) {
      // Se por algum motivo não tiver usuário, vai pro login
      this.router.navigate(['/login']);
      return;
    }

    if (usuario.role === 'admin') {
      // Se for ADMIN -> Vai para o Dashboard
      this.router.navigate(['/admin']);
    } else {
      // Se for CLIENTE -> Vai para o Perfil (ou Home, conforme sua preferência)
      this.router.navigate(['/meu-perfil']); 
    }
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Volta para home
    if (this.menuAberto) {
      this.toggleMenu();
    }
  }
}