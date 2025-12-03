import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../../services/pedidos.service';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export class AdminPedidosComponent implements OnInit {

  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];

  filtroAtual: string = 'Todos';

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.pedidos = this.pedidoService.getTodosPedidos();
    this.pedidosFiltrados = [...this.pedidos];
  }

  aplicarFiltro(filtro: string) {
    this.filtroAtual = filtro;

    if (filtro === 'Todos') {
      this.pedidosFiltrados = [...this.pedidos];
    } else {
      this.pedidosFiltrados = this.pedidos.filter(p => p.status === filtro);
    }
  }

  alterarStatus(pedido: any, novoStatus: string) {
    pedido.status = novoStatus;

    // salvar no localStorage
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));

    // atualizar o filtro atual
    this.aplicarFiltro(this.filtroAtual);
  }
}

