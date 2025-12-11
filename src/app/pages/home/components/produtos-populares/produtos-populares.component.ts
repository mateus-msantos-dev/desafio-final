import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../../services/product.service'; 
import { CartService } from '../../../../services/cart.service';
// 1. Importe o AuthService
import { AuthService } from '../../../../services/auth.service';
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
  isAdmin = false; // 2. Variável
  private autoplaySubscription!: Subscription; 

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService // 3. Injeção
  ) {}
  
  async ngOnInit(): Promise<void> {
    // 4. Checagem
    const user = this.authService.getUsuarioLogado();
    this.isAdmin = user?.role === 'admin';

    await this.productService.loadProducts();
    this.produtos = this.productService.listar().slice(0, 8); 
    this.carregando = false;
    this.startAutoplay();
  }
  
  // ... ngOnDestroy, nextCard, prevCard, startAutoplay, resetAutoplay, get transformStyle, formatPrice (MANTENHA IGUAL) ...
  ngOnDestroy(): void {
    if (this.autoplaySubscription) this.autoplaySubscription.unsubscribe();
  }

  nextCard(): void {
    const maxOffset = this.produtos.length - this.itemsPerView;
    if (this.currentOffset < maxOffset) this.currentOffset++;
    else this.currentOffset = 0; 
    this.resetAutoplay(); 
  }

  prevCard(): void {
    const maxOffset = this.produtos.length - this.itemsPerView;
    if (this.currentOffset > 0) this.currentOffset--;
    else this.currentOffset = maxOffset; 
    this.resetAutoplay(); 
  }
  
  startAutoplay(): void {
    this.autoplaySubscription = interval(5000).subscribe(() => this.nextCard());
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

  addToCart(prod: Product) {
    if (this.isAdmin) return; // Bloqueio lógico
    
    this.cartService.addToCart(prod.id);
    alert(`${prod.name} adicionado ao carrinho`);
  }
}
