import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-produtos-populares',
  imports: [CommonModule],
  templateUrl: './produtos-populares.component.html',
  styleUrl: './produtos-populares.component.css'
})
export class ProdutosPopularesComponent {

  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>

  // Produtos de exemplo
  produtos = [
    { name: 'Bolo de Chocolate', price: 'R$ 40,00', image: '/img/bolo-de-chocolate.jpg' },
    { name: 'Coxinha 50un',      price: 'R$ 30,00', image: '/img/coxinha.webp' },
    { name: 'Brigadeiros',       price: 'R$ 25,00', image: '/img/brigadeiro.jpeg' },
    { name: 'Torta de Limão',  price: 'R$ 42,00', image: '/img/torta-de-limao.jpg' },
    { name: 'Kibe 50un',         price: 'R$ 30,00', image: '/img/kibe.avif' }
  ];

  scrollLeft() {
    this.carousel.nativeElement.scrollLeft -= 250;
  }

  scrollRight() {
    this.carousel.nativeElement.scrollLeft += 250;
  }
}
