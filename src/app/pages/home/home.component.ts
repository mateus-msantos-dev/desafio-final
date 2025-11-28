import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProdutosPopularesComponent } from './components/produtos-populares/produtos-populares.component';
import { ComoFuncionaComponent } from "./components/como-funciona/como-funciona.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, CategoriasComponent, ProdutosPopularesComponent, ComoFuncionaComponent, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
