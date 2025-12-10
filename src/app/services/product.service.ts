import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  short: string;
  price: number;
  image: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private loaded = false; // Flag para saber se já tentamos carregar

  constructor(private http: HttpClient) {}

  /**
   * Carrega os produtos do JSON.
   * Deve ser chamado e aguardado (await) pelo componente antes de listar.
   */
  async loadProducts(): Promise<Product[]> {
    // Se já carregou (mesmo que esteja vazio), não busca de novo
    if (this.loaded) return this.products;

    try {
      const data = await firstValueFrom(this.http.get<Product[]>('assets/data/products.json'));
      this.products = data || [];
      this.loaded = true;
    } catch (e) {
      console.error('Erro ao carregar products.json', e);
      this.products = [];
    }
    return this.products;
  }

  /**
   * Retorna a lista atual de produtos.
   * Retorna uma cópia ([...]) para evitar mutação direta do array privado.
   */
  listar(): Product[] {
    return [...this.products];
  }

  findById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // --- Métodos de CRUD (Em Memória) ---

  criar(prod: Product): Product {
    // Lógica para gerar ID seguro: pega o maior ID atual e soma 1
    // Se a lista estiver vazia, começa com 1
    const maxId = this.products.length > 0 
      ? Math.max(...this.products.map(p => p.id)) 
      : 0;

    prod.id = maxId + 1;
    
    this.products.push(prod);
    return prod;
  }

  atualizar(id: number, dados: Partial<Product>): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    const produtoAtual = this.products[index];

    // Removemos o 'id' dos dados recebidos para garantir que o ID nunca mude
    const { id: _, ...dadosSemId } = dados as any;

    // Atualiza o objeto mantendo a referência
    this.products[index] = { ...produtoAtual, ...dadosSemId };

    return true;
  }

  deletar(id: number): boolean {
    const index = this.products.findIndex(x => x.id === id);
    
    if (index !== -1) {
      this.products.splice(index, 1); // Remove o item do array original
      return true;
    }
    
    return false;
  }
}
