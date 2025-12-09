import { Injectable } from '@angular/core';

// ⬅️ Definição da estrutura do Item que será salvo
export interface OrderItem {
    name: string; // Nome do produto
    quantity: number; // Quantidade comprada
    price: number; // Preço unitário do produto
}

// ⬅️ Definição da estrutura completa do Pedido
export interface Order {
  id: number; // Um ID único (usaremos Date.now())
  userEmail: string; // Para filtro no perfil
  items: OrderItem[]; 
  total: number;
  date: string; // Data da compra (ISOString)
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private storageKey = 'pedidos';

  private loadOrders(): Order[] {
    // Carrega todos os pedidos salvos ou retorna um array vazio
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private saveOrders(orders: Order[]): void {
    // Salva a lista completa de pedidos
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
  }

  /* Salva um novo pedido */
  criarPedido(order: Order) {
    const pedidos = this.loadOrders();
    pedidos.push(order);
    this.saveOrders(pedidos);
  }

  /* Retorna todos os pedidos de um usuário específico */
  listarPorUsuario(email: string): Order[] {
    const pedidos = this.loadOrders();
    return pedidos.filter(p => p.userEmail === email).reverse(); // .reverse() para mostrar os mais recentes primeiro
  }

  listarTodos(): Order[] {
    const pedidos = this.loadOrders();
    // Retorna ordenado do mais recente para o mais antigo
    return pedidos.reverse();
  }

}