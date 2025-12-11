import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service'; 

export interface CategoryGroup {
  name: string;
  products: Product[];
}

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  produtosPorCategoria: CategoryGroup[] = [];
  carregando = true;

  // 🔴 REMOVIDO: categoriasPadrao (agora vem do service)

  constructor(
    private productService: ProductService,
    private cartService: CartService 
  ) {}

  async ngOnInit(): Promise<void> {
    await this.productService.loadProducts();
    const todosProdutos = this.productService.listar();
    
    this.agruparProdutos(todosProdutos);
    this.carregando = false;
  }

  agruparProdutos(produtos: Product[]): void {
    const grupos: { [key: string]: Product[] } = {};
    
    // 1. Agrupa os produtos por chave em minúsculo
    produtos.forEach(prod => {
      const categoryKey = (prod.category || 'outros').toLowerCase(); 
      
      if (!grupos[categoryKey]) {
        grupos[categoryKey] = [];
      }
      grupos[categoryKey].push(prod);
    });

    // 2. Usa a lista oficial do Service para criar a ordem de exibição
    this.produtosPorCategoria = this.productService.VALID_CATEGORIES
      .map(catName => {
        // catName vem como "Kit Festa", precisamos buscar "kit festa" no grupo
        const lookupKey = catName.toLowerCase();
        
        const products = grupos[lookupKey] || [];
        
        // Usamos o nome bonito do Service para o título
        return { name: catName, products: products };
      })
      .filter(group => group.products.length > 0);
  }
  
  // (Opcional) formatCategoryName não é mais tão necessário pois usamos o nome do service, 
  // mas pode manter se quiser garantir formatação extra.
  formatCategoryName(key: string): string {
    if (!key) return 'Outros';
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  formatPrice(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  addToCart(prod: Product) {
    this.cartService.addToCart(prod.id); 
    alert(`${prod.name} adicionado ao carrinho`);
  }
}