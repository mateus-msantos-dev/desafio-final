import { Injectable } from '@angular/core';

// Interfaces para a estrutura do pedido
interface PedidoItem {
  productId: number;
  name: string;
  qty: number;
  price: number;
}

interface Pedido {
  id: number;
  userId: string; // Email do usuário
  userName: string;
  items: PedidoItem[];
  total: number;
  status: 'Pendente' | 'Processando' | 'Finalizado';
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidos: Pedido[] = JSON.parse(localStorage.getItem('pedidos') || '[]');

  constructor() {}

  private salvarPedidos() {
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
  }

  // Novo método para adicionar um pedido
  adicionarPedido(pedidoData: Omit<Pedido, 'id' | 'data' | 'status'>): void {
    const novoPedido: Pedido = {
      id: this.pedidos.length + 1,
      ...pedidoData,
      status: 'Pendente',
      data: new Date().toISOString()
    };
    
    this.pedidos.push(novoPedido);
    this.salvarPedidos();
  }

  // Método para obter pedidos por usuário (para Meu Perfil)
  getPedidosPorUsuario(userId: string): Pedido[] {
    return this.pedidos.filter(p => p.userId === userId);
  }

  // Método para obter todos os pedidos (para Admin)
  getTodosPedidos(): Pedido[] {
    return this.pedidos;
  }
}