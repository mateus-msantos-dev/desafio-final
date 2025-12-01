import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
// ➡️ Importar o novo serviço
import { CartService } from '../../services/cart.service'; 

// ... (Interface CartItem existente) ...
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

  constructor(
    private productService: ProductService,
    private cartService: CartService // ⬅️ Injetar CartService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.productService.loadProducts();
    this.loadCart();
    this.carregando = false;
  }

  loadCart(): void {
    const raw = localStorage.getItem('cart');
    const rawCart: Array<{ productId: number; qty: number }> = raw ? JSON.parse(raw) : [];

    this.cartItems = rawCart
      .map(item => {
        const product = this.productService.findById(item.productId);
        if (!product || item.qty <= 0) return null; 

        return {
          product: product,
          qty: item.qty,
          subtotal: product.price * item.qty
        } as CartItem;
      })
      .filter((item): item is CartItem => item !== null);

    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalValue = this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  formatPrice(v: number): string {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ➡️ NOVOS MÉTODOS DE INTERAÇÃO
  
  increaseQty(productId: number): void {
    this.cartService.increaseQuantity(productId);
    this.loadCart(); // Recarrega os dados para atualizar a tabela e o total
  }

  decreaseQty(productId: number): void {
    this.cartService.decreaseQuantity(productId);
    this.loadCart(); // Recarrega os dados para atualizar a tabela e o total
  }

  remove(productId: number): void {
    this.cartService.removeItem(productId);
    this.loadCart(); // Recarrega os dados para atualizar a tabela e o total
  }

  checkout(): void {
      alert("Pedido finalizado (simulação)! O carrinho será limpo.");
      this.cartService.clearCart(); // Limpa o localStorage e zera o contador
      this.loadCart(); // Atualiza a UI para mostrar que está vazio
  }
}
