import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service'; 
// 1. Importe o AuthService
import { AuthService } from '../../services/auth.service';

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
  isAdmin = false; // 2. Nova variável de controle

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService // 3. Injete o serviço
  ) {}

  async ngOnInit(): Promise<void> {
    // 4. Verifique se é admin logo ao iniciar
    const user = this.authService.getUsuarioLogado();
    this.isAdmin = user?.role === 'admin';

    await this.productService.loadProducts();
    const todosProdutos = this.productService.listar();
    
    this.agruparProdutos(todosProdutos);
    this.carregando = false;
  }

  // ... agruparProdutos, formatCategoryName, formatPrice (MANTENHA IGUAL) ...
  agruparProdutos(produtos: Product[]): void {
    const grupos: { [key: string]: Product[] } = {};
    produtos.forEach(prod => {
      const categoryKey = (prod.category || 'outros').toLowerCase(); 
      if (!grupos[categoryKey]) grupos[categoryKey] = [];
      grupos[categoryKey].push(prod);
    });

    this.produtosPorCategoria = this.productService.VALID_CATEGORIES
      .map(catName => {
        const lookupKey = catName.toLowerCase();
        const products = grupos[lookupKey] || [];
        return { name: catName, products: products };
      })
      .filter(group => group.products.length > 0);
  }

  formatCategoryName(key: string): string {
    if (!key) return 'Outros';
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  formatPrice(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  addToCart(prod: Product) {
    // 5. Bloqueio de segurança extra (opcional, mas recomendado)
    if (this.isAdmin) {
      alert('Administradores não podem fazer compras.');
      return;
    }
    
    this.cartService.addToCart(prod.id); 
    alert(`${prod.name} adicionado ao carrinho`);
  }
}