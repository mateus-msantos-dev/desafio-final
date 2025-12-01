import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';

// Interface que representa um item completo no carrinho
interface CartItem {
  product: Product;
  qty: number;
  subtotal: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalValue: number = 0;
  carregando = true;

  constructor(private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    // 1. Garante que os produtos estão carregados no serviço
    await this.productService.loadProducts();
    
    // 2. Carrega e processa os itens do localStorage
    this.loadCart();
    
    this.carregando = false;
  }

  loadCart(): void {
    const raw = localStorage.getItem('cart');
    // Estrutura do carrinho no localStorage: [{ productId: 1, qty: 2 }, ...]
    const rawCart: Array<{ productId: number; qty: number }> = raw ? JSON.parse(raw) : [];

    this.cartItems = rawCart
      .map(item => {
        const product = this.productService.findById(item.productId);
        
        // Ignora itens se o produto não for encontrado (segurança)
        if (!product || item.qty <= 0) return null; 

        return {
          product: product,
          qty: item.qty,
          subtotal: product.price * item.qty
        } as CartItem;
      })
      .filter((item): item is CartItem => item !== null); // Filtra itens nulos

    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalValue = this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  formatPrice(v: number): string {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Opções para interatividade (futuro)
  // removeOne(productId: number): void { ... }
  // removeAll(productId: number): void { ... }
}
