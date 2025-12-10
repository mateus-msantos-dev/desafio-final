import { Component, inject, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../../services/product.service'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // ⬅️ Importante: Importar o Router

@Component({
  selector: 'app-listar-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-produtos.component.html',
  styleUrls: ['./listar-produtos.component.css'] 
})
export class ListarProdutosComponent implements OnInit {
  
  // Injeção de dependências moderna
  private productService = inject(ProductService);
  private router = inject(Router); // ⬅️ Injetando o Router

  listaProdutos: Product[] = [];
  isLoading: boolean = true; 

  async ngOnInit() {
    await this.productService.loadProducts();
    this.atualizarLista();
    this.isLoading = false;
  }

  atualizarLista() {
    this.listaProdutos = this.productService.listar();
  }

  // ⬅️ Nova função para navegar para a criação
  navegarParaNovo() {
    this.router.navigate(['/admin/criar-produto']);
  }

  // ⬅️ Nova função que faz o botão Editar funcionar
  editarProduto(id: number) {
    this.router.navigate(['/admin/produtos/editar', id]);
  }

  onDeletar(id: number) {
    if(confirm('Tem certeza que deseja excluir este produto?')) {
      const sucesso = this.productService.deletar(id);
      if (sucesso) {
        this.atualizarLista();
      } else {
        alert('Erro ao excluir.');
      }
    }
  }
}
