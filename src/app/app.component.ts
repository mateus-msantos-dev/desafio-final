import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'desafio-final';

  private excludedRoutes: string[] = ['/login'];

  constructor(private router: Router){}

  ngOnInit(): void {
    // Você pode usar o router.events aqui, mas o getter é mais simples para este caso
  }

  // 2. Método para verificar se a rota atual é de exclusão
  get isLoginRoute(): boolean {
    // Retorna true se a URL atual for uma rota que deve excluir o footer
    return this.excludedRoutes.includes(this.router.url);
  }
}
