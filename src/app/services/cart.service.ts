import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Estrutura simplificada do item no localStorage
interface LocalCartItem {
  productId: number;
  qty: number;
}

@Injectable({
  // Garante que o serviço seja um singleton (instância única)
  providedIn: 'root'
})
export class CartService {
  // BehaviorSubject: armazena o estado atual (0) e emite para novos subscritores
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  
  // Observable: O componente Header irá subscrever-se a este
  cartItemCount$: Observable<number> = this.cartItemCountSubject.asObservable();

  constructor() {
    // Inicializa o contador com o valor atual do localStorage
    this.updateCartCount();
  }

  // --- Lógica de Leitura ---

  private getCartItems(): LocalCartItem[] {
    const raw = localStorage.getItem('cart');
    // Retorna a lista de objetos ou um array vazio
    return raw ? (JSON.parse(raw) as LocalCartItem[]) : [];
  }

  // Calcula o total de unidades no carrinho e notifica todos os subscritores
  updateCartCount(): void {
    const items = this.getCartItems();
    // Soma a quantidade (qty) de todos os itens
    const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
    this.cartItemCountSubject.next(totalCount);
  }

  // --- Lógica de Modificação (Refatoração Necessária) ---

  // Refatora a função que adiciona/atualiza itens no carrinho
  addToCart(productId: number, qty: number = 1): void {
    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].qty += qty;
    } else {
      currentItems.push({ productId, qty });
    }

    // 1. Salva o novo estado no localStorage
    localStorage.setItem('cart', JSON.stringify(currentItems));
    
    // 2. ATUALIZA O CONTADOR DO HEADER
    this.updateCartCount();
  }
}
