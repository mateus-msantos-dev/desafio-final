import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css']
})
export class MeuPerfilComponent implements OnInit {

  usuario: any = null;
  pedidos: Order[] = [];

  constructor(
    private auth: AuthService, 
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.usuario = this.auth.getUsuarioLogado();

    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    // Carregar pedidos do usuário
    this.pedidos = this.orderService.listarPorUsuario(this.usuario.email);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
