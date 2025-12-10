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
  isAdmin: boolean = false; // ⬅️ 1. Nova variável
  
  private cartSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Contador do Carrinho
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(
      (count) => {
        this.cartItemCount = count;
      }
    );
    
    // Estado de Login e Verificação de Admin
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.isUserLoggedIn = isLoggedIn;

        // ⬅️ 2. Verificamos se é admin toda vez que o status de login muda
        const user = this.authService.getUsuarioLogado();
        this.isAdmin = user?.role === 'admin';
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

  navegarParaPerfil() {
    const usuario = this.authService.getUsuarioLogado();

    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    if (usuario.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/meu-perfil']); 
    }
  }
  
  logout() {
    this.authService.logout();
    this.isAdmin = false; // Reseta variável ao sair
    this.router.navigate(['/']); 
    if (this.menuAberto) {
      this.toggleMenu();
    }
  }
}