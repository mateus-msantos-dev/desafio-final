import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';

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
  // Alteramos 'produtos' para 'produtosPorCategoria'
  produtosPorCategoria: CategoryGroup[] = [];
  carregando = true;

  // Lista de categorias que devem aparecer, em ordem.
  // Você pode adicionar 'salgados' aqui se for incluir no JSON depois.
  readonly categoriasPadrao = ['bolos', 'doces', 'tortas', 'salgados']; 

  constructor(private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    await this.productService.loadProducts();
    const todosProdutos = this.productService.listar();
    
    this.agruparProdutos(todosProdutos); // Chama a nova função de agrupamento
    this.carregando = false;
  }

  // Novo método para agrupar os produtos
  agruparProdutos(produtos: Product[]): void {
    const grupos: { [key: string]: Product[] } = {};
    
    produtos.forEach(prod => {
      // Usa 'outros' se a categoria não estiver definida
      const categoryKey = (prod.category || 'outros').toLowerCase(); 
      
      if (!grupos[categoryKey]) {
        grupos[categoryKey] = [];
      }
      grupos[categoryKey].push(prod);
    });

    // Converte o objeto agrupado para a lista de CategoryGroup, seguindo a ordem padrão
    this.produtosPorCategoria = this.categoriasPadrao
      .map(key => {
        const title = this.formatCategoryName(key);
        const products = grupos[key] || [];
        return { name: title, products: products };
      })
      .filter(group => group.products.length > 0); // Remove categorias sem produtos
  }
  
  // Função auxiliar para formatar o nome da categoria (ex: 'bolos' -> 'Bolos')
  formatCategoryName(key: string): string {
    if (!key) return 'Outros';
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  formatPrice(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  addToCart(prod: Product) {
    // ... (o código addToCart permanece o mesmo)
    const raw = localStorage.getItem('cart');
    const cart: Array<{ productId: number; qty: number }> = raw ? JSON.parse(raw) : [];

    const item = cart.find(i => i.productId === prod.id);
    if (item) item.qty += 1;
    else cart.push({ productId: prod.id, qty: 1 });

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${prod.name} adicionado ao carrinho`);
  }
}