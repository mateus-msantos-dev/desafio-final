import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../../services/order.service'; // Usando o serviço que funciona
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export class AdminPedidosComponent implements OnInit {
  
  // Criamos uma lista "enriquecida" que terá o pedido + dados do cliente
  pedidosExpandidos: any[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    // 1. Pega todos os pedidos (usando o serviço certo)
    const todosPedidos = this.orderService.listarTodos();
    
    // 2. Pega todos os usuários para cruzarmos os dados
    const todosUsuarios = this.authService.getTodosUsuarios();

    // 3. Cruzamento de dados (JOIN)
    this.pedidosExpandidos = todosPedidos.map(pedido => {
      // Procura quem é o dono desse pedido pelo email
      const cliente = todosUsuarios.find(u => u.email === pedido.userEmail);

      return {
        ...pedido, // Copia dados do pedido (id, total, items, date)
        // Adiciona dados do cliente (ou texto padrão se não achar)
        status: pedido.status || 'pendente',
        clienteNome: cliente ? cliente.nome : 'Cliente Desconhecido',
        clienteTelefone: cliente ? cliente.telefone : 'Não informado',
        clienteEmail: pedido.userEmail
      };
    });
  }

  removerPedido(id: number): void {
    if (confirm('Tem certeza que deseja remover este pedido permanentemente?')) {
      // 1. Remove do "banco de dados" (localStorage)
      this.orderService.removerPedido(id);
      
      // 2. Remove da lista visual (pedidosExpandidos) para atualizar a tela na hora
      this.pedidosExpandidos = this.pedidosExpandidos.filter(p => p.id !== id);
    }
  }

  confirmarEntrega(id: number): void {
    // 1. Atualiza no "banco" (localStorage)
    this.orderService.marcarComoEntregue(id);

    // 2. Atualiza na tela visualmente sem precisar recarregar
    const pedido = this.pedidosExpandidos.find(p => p.id === id);
    if (pedido) {
      pedido.status = 'entregue';
    }
  }
}


