import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';
// ➡️ Importar o novo serviço de carrinho
import { CartService } from '../../services/cart.service'; 

// Nova interface para a estrutura de produtos agrupados
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

  readonly categoriasPadrao = ['bolos', 'doces', 'tortas', 'salgados', 'kit-festa']; 

  // ➡️ Injetar o CartService no construtor
  constructor(
    private productService: ProductService,
    private cartService: CartService // ⬅️ Injeção do serviço
  ) {}

  async ngOnInit(): Promise<void> {
    await this.productService.loadProducts();
    const todosProdutos = this.productService.listar();
    
    this.agruparProdutos(todosProdutos);
    this.carregando = false;
  }

  // Novo método para agrupar os produtos (inalterado)
  agruparProdutos(produtos: Product[]): void {
    const grupos: { [key: string]: Product[] } = {};
    
    produtos.forEach(prod => {
      const categoryKey = (prod.category || 'outros').toLowerCase(); 
      
      if (!grupos[categoryKey]) {
        grupos[categoryKey] = [];
      }
      grupos[categoryKey].push(prod);
    });

    this.produtosPorCategoria = this.categoriasPadrao
      .map(key => {
        const title = this.formatCategoryName(key);
        const products = grupos[key] || [];
        return { name: title, products: products };
      })
      .filter(group => group.products.length > 0);
  }
  
  // Função auxiliar para formatar o nome da categoria (inalterado)
  formatCategoryName(key: string): string {
    if (!key) return 'Outros';
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  formatPrice(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ➡️ Método addToCart modificado para usar o CartService
  addToCart(prod: Product) {
    // ➡️ Chama o método centralizado no CartService.
    // O serviço agora cuida de atualizar o localStorage E o contador do header.
    this.cartService.addToCart(prod.id); 
    
    alert(`${prod.name} adicionado ao carrinho`);
  }
}