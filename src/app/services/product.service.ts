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
  private loaded = false; 

  // 🔴 CENTRALIZAÇÃO: Lista oficial de categorias (usada no criar e no listar)
  // Usamos Title Case (Maiúsculas) para ficar bonito no Dropdown
  readonly VALID_CATEGORIES = ['Bolos', 'Tortas', 'Salgados', 'Doces', 'Kit Festa'];

  constructor(private http: HttpClient) {}

  async loadProducts(): Promise<Product[]> {
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

  listar(): Product[] {
    return [...this.products];
  }

  findById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  criar(prod: Product): Product {
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
    const { id: _, ...dadosSemId } = dados as any;

    this.products[index] = { ...produtoAtual, ...dadosSemId };
    return true;
  }

  deletar(id: number): boolean {
    const index = this.products.findIndex(x => x.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }
}
