import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // ⬅️ Importe isso

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterLink], // ⬅️ Adicione aqui
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

}
