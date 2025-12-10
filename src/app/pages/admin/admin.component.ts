import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-root',
  standalone: true,
  imports: [RouterOutlet], // OBRIGATÓRIO: Importar RouterOutlet para funcionar o HTML
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  // Esse componente é simples, serve apenas para segurar as rotas filhas
}