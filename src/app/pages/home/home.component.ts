import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProdutosPopularesComponent } from './components/produtos-populares/produtos-populares.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, CategoriasComponent, ProdutosPopularesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
