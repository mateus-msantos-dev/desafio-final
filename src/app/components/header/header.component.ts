import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
// ⬅️ Importe o serviço

import { Subscription } from 'rxjs'; // Importe Subscription para gerenciar a memória
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  // Certifique-se de incluir RouterLink e CommonModule
  imports: [CommonModule, RouterLink], 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuAberto = false;
  // ⬅️ Variável para armazenar o valor do contador
  cartItemCount: number = 0; 
  private cartSubscription!: Subscription;

  // ⬅️ Injetar o CartService
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // ⬅️ Subscrever ao BehaviorSubject do serviço
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(
      (count) => {
        // Atualiza a variável local toda vez que o serviço notifica uma mudança
        this.cartItemCount = count;
      }
    );
  }

  ngOnDestroy(): void {
    // ⬅️ Desinscrever-se para evitar vazamentos de memória (memory leaks)
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }
}
