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

  constructor(private http: HttpClient) {}

  async loadProducts(): Promise<Product[]> {
    // se já carregados, retorna imediatamente
    if (this.products.length) return this.products;

    try {
      const data = await firstValueFrom(this.http.get<Product[]>('assets/data/products.json'));
      this.products = data || [];
    } catch (e) {
      console.error('Erro ao carregar products.json', e);
      this.products = [];
    }
    return this.products;
  }

  listar(): Product[] {
    return this.products;
  }

  findById(id: number) {
    return this.products.find(p => p.id === id);
  }

  // métodos de CRUD (simulados em memória)
  criar(prod: Product) {
    prod.id = Date.now();
    this.products.push(prod);
    return prod;
  }

  atualizar(id: number, dados: Partial<Product>) {
    const p = this.findById(id);
    if (!p) return false;
    Object.assign(p, dados);
    return true;
  }

  deletar(id: number) {
    const before = this.products.length;
    this.products = this.products.filter(x => x.id !== id);
    return before !== this.products.length;
  }
}
