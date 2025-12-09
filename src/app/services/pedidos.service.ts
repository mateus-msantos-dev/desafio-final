import { Injectable } from '@angular/core';

// ---- Interfaces ---- //
export interface PedidoItem {
  productId: number;
  name: string;
  qty: number;
  price: number;
}

export interface Pedido {
  id: number;
  nome: string;        // nome do cliente
  telefone: string;    // telefone do cliente
  email: string;       // email do cliente
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

  // Salvar no localStorage
  private salvarPedidos() {
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
  }

  // ---- ADICIONAR PEDIDO ---- //
  adicionarPedido(pedidoData: {
    nome: string;
    telefone: string;
    email: string;
    items: PedidoItem[];
    total: number;
  }): void {

    const novoPedido: Pedido = {
      id: this.pedidos.length + 1,
      ...pedidoData,
      status: 'Pendente',
      data: new Date().toISOString()
    };

    this.pedidos.push(novoPedido);
    this.salvarPedidos();
  }

  // ---- PEDIDOS DO USUÁRIO ---- //
  getPedidosPorUsuario(email: string): Pedido[] {
    return this.pedidos.filter(p => p.email === email);
  }

  // ---- TODOS OS PEDIDOS (admin) ---- //
  getTodosPedidos(): Pedido[] {
    return this.pedidos;
  }

  // ---- ALTERAR STATUS (admin) ---- //
  alterarStatus(id: number, novoStatus: 'Pendente' | 'Processando' | 'Finalizado') {
    const pedido = this.pedidos.find(p => p.id === id);
    if (pedido) {
      pedido.status = novoStatus;
      this.salvarPedidos();
    }
  }
}

