import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface LocalCartItem {
  productId: number;
  qty: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$: Observable<number> = this.cartItemCountSubject.asObservable();

  constructor() {
    this.updateCartCount();
  }

  private getCartItems(): LocalCartItem[] {
    const raw = localStorage.getItem('cart');
    return raw ? (JSON.parse(raw) as LocalCartItem[]) : [];
  }

  // Novo método: Centraliza a escrita no localStorage e notifica o contador
  private saveCart(items: LocalCartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.updateCartCount();
  }

  updateCartCount(): void {
    const items = this.getCartItems();
    const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
    this.cartItemCountSubject.next(totalCount);
  }

  // --- MÉTODOS DE INTERAÇÃO COM O CARRINHO ---

  // Método usado pelo ProdutosComponent (e por increaseQuantity)
  addToCart(productId: number, qty: number = 1): void {
    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].qty += qty;
    } else {
      currentItems.push({ productId, qty });
    }
    
    this.saveCart(currentItems);
  }
  
  // Novo método: Aumentar a quantidade
  increaseQuantity(productId: number): void {
    this.addToCart(productId, 1);
  }

  // Novo método: Diminuir a quantidade
  decreaseQuantity(productId: number): void {
    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      currentItems[itemIndex].qty -= 1;

      // Se a quantidade for <= 0, remove o item
      if (currentItems[itemIndex].qty <= 0) {
        currentItems.splice(itemIndex, 1);
      }
      this.saveCart(currentItems);
    }
  }

  // Novo método: Remover item completamente
  removeItem(productId: number): void {
    let currentItems = this.getCartItems();
    currentItems = currentItems.filter(item => item.productId !== productId);
    this.saveCart(currentItems);
  }

  // Novo método: Limpar o carrinho (útil para checkout)
  clearCart(): void {
    localStorage.removeItem('cart');
    this.updateCartCount();
  }
}
