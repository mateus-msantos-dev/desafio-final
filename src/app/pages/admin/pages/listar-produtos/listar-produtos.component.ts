import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../../services/product.service'; // Ajuste o caminho
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-produtos',
  imports: [CommonModule],
  templateUrl: './listar-produtos.component.html',
  styleUrls: ['./listar-produtos.component.css'] // ou scss
})
export class ListarProdutosComponent implements OnInit {
  
  listaProdutos: Product[] = [];
  isLoading: boolean = true; // Para mostrar um "Carregando..." no HTML

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    // 1. Aguarda o carregamento dos dados do JSON
    await this.productService.loadProducts();

    // 2. Agora que temos certeza que carregou, buscamos a lista
    this.atualizarLista();
    
    // 3. Desativa o loading
    this.isLoading = false;
  }

  atualizarLista() {
    this.listaProdutos = this.productService.listar();
  }

  // Exemplo de como deletar e atualizar a tela imediatamente
  onDeletar(id: number) {
    if(confirm('Tem certeza que deseja excluir este produto?')) {
      const sucesso = this.productService.deletar(id);
      if (sucesso) {
        this.atualizarLista();
      }
    }
  }
  
  // Método auxiliar para o botão (click) no HTML do exemplo
  alert(msg: string) {
    window.alert(msg);
  }
}
