import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lgpd',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lgpd.component.html',
  styleUrls: ['./lgpd.component.css']
})
export class LgpdComponent {
  hoje = new Date().toLocaleDateString('pt-BR');
}