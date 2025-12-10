import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../../services/product.service'; 
// 1. Importar o CartService
import { CartService } from '../../../../services/cart.service';
import { interval, Subscription } from 'rxjs'; 

@Component({
  selector: 'app-produtos-populares',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './produtos-populares.component.html',
  styleUrl: './produtos-populares.component.css'
})
export class ProdutosPopularesComponent implements OnInit, OnDestroy {
  
  produtos: Product[] = []; 
  carregando = true;
  currentOffset: number = 0; 
  readonly itemsPerView: number = 4;
  private autoplaySubscription!: Subscription; 

  constructor(
    private productService: ProductService,
    private cartService: CartService // 2. Injetar o CartService
  ) {}
  
  async ngOnInit(): Promise<void> {
    await this.productService.loadProducts();
    // Pega os 8 primeiros para o carrossel
    this.produtos = this.productService.listar().slice(0, 8); 
    this.carregando = false;
    this.startAutoplay();
  }
  
  ngOnDestroy(): void {
    if (this.autoplaySubscription) {
      this.autoplaySubscription.unsubscribe();
    }
  }

  // --- LÓGICA DO CARRINHO (Copiada de produtos.component.ts) ---
  addToCart(prod: Product) {
    this.cartService.addToCart(prod.id);
    // Você pode usar um Toast/Snackbar aqui se preferir ao invés de alert
    alert(`${prod.name} adicionado ao carrinho`);
  }

  // --- LÓGICA DE NAVEGAÇÃO E CARROSSEL ---

  nextCard(): void {
    const maxOffset = this.produtos.length - this.itemsPerView;
    if (this.currentOffset < maxOffset) {
      this.currentOffset++;
    } else {
      this.currentOffset = 0; 
    }
    this.resetAutoplay(); 
  }

  prevCard(): void {
    const maxOffset = this.produtos.length - this.itemsPerView;
    if (this.currentOffset > 0) {
      this.currentOffset--;
    } else {
      this.currentOffset = maxOffset; 
    }
    this.resetAutoplay(); 
  }
  
  startAutoplay(): void {
    this.autoplaySubscription = interval(5000).subscribe(() => {
      this.nextCard();
    });
  }
  
  resetAutoplay(): void {
    this.autoplaySubscription.unsubscribe();
    this.startAutoplay();
  }

  get transformStyle(): string {
    const translateValue = -1 * this.currentOffset * (100 / this.itemsPerView); 
    return `translateX(${translateValue}%)`;
  }
  
  formatPrice(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
