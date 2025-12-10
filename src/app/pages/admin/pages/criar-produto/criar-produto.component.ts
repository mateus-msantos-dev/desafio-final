import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
// Importe a interface Product também
import { ProductService, Product } from '../../../../services/product.service'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-criar-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-produto.component.html',
  styleUrl: './criar-produto.component.css'
})
export class CriarProdutoComponent implements OnInit {
  fb = inject(FormBuilder);
  productService = inject(ProductService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // Lista fixa de categorias
  categorias = ['Bolos', 'Tortas', 'Salgados', 'Doces', 'Kit Festa'];

  // Definição do Formulário
  produtoForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    preco: [null, [Validators.required, Validators.min(0.01)]],
    categoria: ['', Validators.required], 
    imagem: ['', Validators.required]
  });

  isEditMode = false;
  produtoId: number | null = null; // Variável para armazenar o ID na edição

  async ngOnInit() {
    // 1. Garante que os produtos estejam carregados do JSON/API
    await this.productService.loadProducts();

    // 2. Verifica se existe um ID na URL (ex: /admin/produtos/editar/5)
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.produtoId = Number(idParam);
      this.carregarDadosParaEdicao(this.produtoId);
    }
  }

  carregarDadosParaEdicao(id: number) {
    const produto = this.productService.findById(id);

    if (produto) {
      this.isEditMode = true;
      
      // Mapeamento: Interface Product (Inglês) -> Formulário (Português)
      this.produtoForm.patchValue({
        nome: produto.name,
        descricao: produto.short, // Assumindo que 'short' é a descrição
        preco: produto.price,
        imagem: produto.image,
        categoria: produto.category || '' // Garante que não venha undefined
      });
    } else {
      alert('Produto não encontrado!');
      this.router.navigate(['/admin/produtos']);
    }
  }

  onSubmit() {
    if (this.produtoForm.invalid) {
      this.produtoForm.markAllAsTouched(); // Mostra todos os erros se tentar salvar vazio
      return;
    }

    const dadosForm = this.produtoForm.value;

    // Prepara o objeto no formato que o Service espera (Interface Product)
    const produtoParaSalvar: Partial<Product> = {
      name: dadosForm.nome,
      short: dadosForm.descricao,
      price: dadosForm.preco,
      image: dadosForm.imagem,
      category: dadosForm.categoria
    };

    if (this.isEditMode && this.produtoId) {
      // --- ATUALIZAR ---
      // Passamos o ID e os dados (exceto o ID, que o service protege)
      const sucesso = this.productService.atualizar(this.produtoId, produtoParaSalvar);
      
      if (sucesso) {
        alert('Produto atualizado com sucesso!');
        this.router.navigate(['/admin/produtos']);
      } else {
        alert('Erro ao atualizar produto.');
      }

    } else {
      // --- CRIAR ---
      // Precisamos converter para o tipo Product completo (o ID o service gera)
      const novoProduto = produtoParaSalvar as Product;
      
      this.productService.criar(novoProduto);
      alert('Produto criado com sucesso!');
      this.router.navigate(['/admin/produtos']);
    }
  }

  onCancelar() {
    // Se for edição volta pro dashboard ou lista, se for criação também.
    // Ajuste a rota conforme sua preferência.
    this.router.navigate(['/admin']); 
  }
}
