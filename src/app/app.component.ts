import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, // Adicionei standalone se for v17+, se não, pode remover
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'desafio-final';

  // Rotas exatas onde o footer não aparece
  private excludedRoutes: string[] = ['/login', '/cadastro'];

  constructor(private router: Router){}

  // Lógica para esconder o Footer
  get shouldShowFooter(): boolean {
    // 1. Pega a URL atual
    const currentUrl = this.router.url;

    // 2. Se for login ou cadastro -> Esconde (false)
    if (this.excludedRoutes.includes(currentUrl)) {
      return false;
    }

    // 3. Se a rota COMEÇAR com /admin (ex: /admin/produtos) -> Esconde (false)
    if (currentUrl.startsWith('/admin')) {
      return false;
    }

    // Caso contrário -> Mostra (true)
    return true;
  }
}
