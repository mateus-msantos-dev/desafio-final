import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../../services/order.service';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export class AdminPedidosComponent implements OnInit {

  pedidos: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.pedidos = this.orderService.listarPorUsuario(''); 
    // acima pega todos, pois "" nunca filtra
    this.pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
  }

  formatPrice(v: number): string {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
