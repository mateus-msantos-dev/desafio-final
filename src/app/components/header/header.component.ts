import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // ⬅️ Adicionar Router
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service'; // ⬅️ IMPORTAR AuthService

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
  isUserLoggedIn: boolean = false; // ⬅️ Nova variável para estado de login
  
  private cartSubscription!: Subscription;
  private authSubscription!: Subscription; // ⬅️ Nova Subscription

  constructor(
    private cartService: CartService,
    private authService: AuthService, // ⬅️ Injetar AuthService
    private router: Router // ⬅️ Injetar Router para logout
  ) {}

  ngOnInit(): void {
    // Subscrição do Contador do Carrinho (Existente)
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(
      (count) => {
        this.cartItemCount = count;
      }
    );
    
    // ⬅️ NOVA Subscrição do Estado de Login
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.isUserLoggedIn = isLoggedIn;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    // ⬅️ Desinscrever-se do AuthService
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }
  
  // ⬅️ NOVO Método de Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Redireciona para a home após o logout
    // Se o menu mobile estiver aberto, feche-o
    if (this.menuAberto) {
      this.toggleMenu();
    }
  }
}
