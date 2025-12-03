import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { PedidoService } from '../../services/pedidos.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-container">
      <h2>Finalizando seu Pedido...</h2>

      <div *ngIf="status === 'processando'" class="message">
        Estamos confirmando seu pedido. Aguarde...
      </div>

      <div *ngIf="status === 'sucesso'" class="message success">
        Pedido realizado com sucesso! Você será redirecionado para seu perfil.
      </div>

      <div *ngIf="status === 'erro'" class="message error">
        Erro ao processar o pedido. Tente novamente.
      </div>
    </div>
  `,
  styles: [`
    .checkout-container { max-width: 600px; margin: 80px auto; padding: 20px; text-align: center; }
    .message { padding: 15px; border-radius: 8px; margin-top: 20px; }
    .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  `]
})
export class CheckoutComponent implements OnInit {

  status: 'processando' | 'sucesso' | 'erro' = 'processando';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.enviarPedido();
  }

  enviarPedido() {
    const usuario = this.authService.getUsuarioLogado();
    const itensCarrinho = this.cartService.getCartItems();

    // ⚠️ Segurança
    if (!usuario || itensCarrinho.length === 0) {
      this.status = 'erro';
      this.router.navigate(['/carrinho']);
      return;
    }

    // ---- 1. Criar lista de itens ---- //
    let total = 0;

    const itens = itensCarrinho.map(item => {
      const prod = this.productService.findById(item.productId);

      const subtotal = prod ? prod.price * item.qty : 0;
      total += subtotal;

      return {
        productId: item.productId,
        name: prod?.name ?? 'Produto',
        qty: item.qty,
        price: prod?.price ?? 0
      };
    });

    // ---- 2. Montar o pedido com nome e telefone ---- //
    const pedido = {
      nome: usuario.nome,         // vem do cadastro
      telefone: usuario.telefone, // vem do cadastro
      email: usuario.email,
      items: itens,
      total: total
    };

    // ---- 3. Salvar pedido ---- //
    this.pedidoService.adicionarPedido(pedido);

    // ---- 4. Limpar carrinho ---- //
    this.cartService.clearCart();

    // ---- 5. Atualizar interface ---- //
    this.status = 'sucesso';

    // ---- 6. Redirecionar ---- //
    setTimeout(() => {
      if (usuario.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/meu-perfil']);
      }
    }, 2000);
  }
}
