import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
// ⬅️ Importar serviços e lógica de tempo
import { ProductService, Product } from '../../../../services/product.service'; 
import { interval, Subscription } from 'rxjs'; 

@Component({
  selector: 'app-produtos-populares',
  standalone: true,
  imports: [CommonModule, RouterLink], // ⬅️ Adicionar RouterLink para navegação nos cards
  templateUrl: './produtos-populares.component.html',
  styleUrl: './produtos-populares.component.css'
})
export class ProdutosPopularesComponent implements OnInit, OnDestroy {
  
  // Lista de produtos reais
  produtos: Product[] = []; 
  carregando = true;

  // ⬅️ NOVO: Variável para rastrear o deslocamento do carrossel
  currentOffset: number = 0; 
  
  // Quantidade de itens visíveis
  readonly itemsPerView: number = 4;
  
  // Variável para armazenar a inscrição do autoplay e limpar no final
  private autoplaySubscription!: Subscription; 

  constructor(private productService: ProductService) {}
  
  // ⬅️ Implementar OnInit e OnDestroy
  async ngOnInit(): Promise<void> {
    await this.productService.loadProducts();
    // 1. Obter dados reais (ex: os 8 primeiros)
    this.produtos = this.productService.listar().slice(0, 8); 
    
    this.carregando = false;
    // 2. Inicia o Autoplay
    this.startAutoplay();
  }
  
  ngOnDestroy(): void {
    // 3. Limpa a assinatura quando o componente é destruído (MUITO IMPORTANTE!)
    if (this.autoplaySubscription) {
      this.autoplaySubscription.unsubscribe();
    }
  }

  // --- LÓGICA DE NAVEGAÇÃO ---

  nextCard(): void {
    // Máximo de posições que o carrossel pode deslocar.
    const maxOffset = this.produtos.length - this.itemsPerView;
    
    if (this.currentOffset < maxOffset) {
      this.currentOffset++;
    } else {
      // Volta para o início (loop)
      this.currentOffset = 0; 
    }
    this.resetAutoplay(); 
  }

  prevCard(): void {
    const maxOffset = this.produtos.length - this.itemsPerView;

    if (this.currentOffset > 0) {
      this.currentOffset--;
    } else {
      // Vai para o final (loop)
      this.currentOffset = maxOffset; 
    }
    this.resetAutoplay(); 
  }
  
  // --- LÓGICA DE AUTOPLAY (5 SEGUNDOS) ---

  startAutoplay(): void {
    this.autoplaySubscription = interval(5000).subscribe(() => {
      this.nextCard();
    });
  }
  
  resetAutoplay(): void {
    this.autoplaySubscription.unsubscribe();
    this.startAutoplay();
  }

  // --- ESTILOS DINÂMICOS ---
  
  // Retorna o valor do CSS transform para deslocar o carrossel (25% por card)
  get transformStyle(): string {
    const translateValue = -1 * this.currentOffset * (100 / this.itemsPerView); 
    // Considerando o gap, a precisão ideal será feita no CSS. Aqui usamos 25%
    return `translateX(${translateValue}%)`;
  }
  
  formatPrice(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
