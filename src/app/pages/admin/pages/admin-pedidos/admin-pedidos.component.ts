import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Item {
  name: string;
  qty: number;
  price: number;
}

interface Pedido {
  id: number;
  userName: string;
  userPhone?: string;
  items: Item[];
  total: number;
}

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];

  ngOnInit(): void {
    this.loadPedidosFromLocalStorage();
  }

  loadPedidosFromLocalStorage(): void {
    const raw = localStorage.getItem('pedidos');
    if (!raw) {
      this.pedidos = [];
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      // tentativa de normalizar — aceitar arrays simples
      if (Array.isArray(parsed)) {
        this.pedidos = parsed as Pedido[];
      } else {
        this.pedidos = [];
        console.warn('localStorage "pedidos" não é um array');
      }
    } catch (e) {
      console.error('Erro parsing localStorage.pedidos', e);
      this.pedidos = [];
    }
  }

  formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  itemSubtotal(item: Item): number {
    return (item.price || 0) * (item.qty || 0);
  }
}


