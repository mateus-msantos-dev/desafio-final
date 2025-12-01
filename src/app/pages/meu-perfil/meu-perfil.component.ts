import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css']
})
export class MeuPerfilComponent implements OnInit {

  usuario: any = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.usuario = this.auth.getUsuarioLogado();

    if (!this.usuario) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
