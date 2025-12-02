import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
// ➡️ Importar o novo serviço
import { CartService } from '../../services/cart.service'; 
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

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
    private cartService: CartService, // ⬅️ Injetar CartService
    private authService: AuthService,   // ⬅️ adicionar
    private orderService: OrderService,
    private router: Router
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
  // Se não estiver logado → alerta e redireciona
  if (!this.authService.isAuthenticated()) {
      alert("Você precisa estar logado para finalizar a compra.");
      this.router.navigate(['/login']);
      return;
  }

  // Usuário logado
  const usuario = this.authService.getUsuarioLogado();
  if (!usuario) return;

  // Montar o pedido com base no carrinho atual
  const order = {
    id: Date.now(),
    userEmail: usuario.email,
    date: new Date().toISOString(),
    total: this.totalValue,
    items: this.cartItems.map(item => ({
      name: item.product.name,
      quantity: item.qty,
      price: item.product.price
    }))
  };

  // Salvar pedido no localStorage
  this.orderService.criarPedido(order);

  alert("Pedido realizado com sucesso!");

  // Limpar carrinho
  this.cartService.clearCart();
  this.loadCart();
}
}
