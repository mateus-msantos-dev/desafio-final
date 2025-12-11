import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../../services/product.service';

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

  // 🔴 ATUALIZADO: Agora pega do Service
  categorias = this.productService.VALID_CATEGORIES;

  produtoForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    preco: [null, [Validators.required, Validators.min(0.01)]],
    categoria: ['', Validators.required], 
    imagem: ['', Validators.required]
  });

  isEditMode = false;
  produtoId: number | null = null; 

  async ngOnInit() {
    await this.productService.loadProducts();

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
      
      this.produtoForm.patchValue({
        nome: produto.name,
        descricao: produto.short,
        preco: produto.price,
        imagem: produto.image,
        categoria: produto.category || ''
      });
    } else {
      alert('Produto não encontrado!');
      this.router.navigate(['/admin/produtos']);
    }
  }

  onSubmit() {
    if (this.produtoForm.invalid) {
      this.produtoForm.markAllAsTouched();
      return;
    }

    const dadosForm = this.produtoForm.value;

    const produtoParaSalvar: Partial<Product> = {
      name: dadosForm.nome,
      short: dadosForm.descricao,
      price: dadosForm.preco,
      image: dadosForm.imagem,
      category: dadosForm.categoria
    };

    if (this.isEditMode && this.produtoId) {
      // --- ATUALIZAR ---
      const sucesso = this.productService.atualizar(this.produtoId, produtoParaSalvar);
      
      if (sucesso) {
        alert('Produto atualizado com sucesso!');
        this.router.navigate(['/admin/produtos']);
      } else {
        alert('Erro ao atualizar produto.');
      }

    } else {
      // --- CRIAR ---
      const novoProduto = produtoParaSalvar as Product;
      
      this.productService.criar(novoProduto);
      alert('Produto criado com sucesso!');
      this.router.navigate(['/admin/produtos']);
    }
  }

  onCancelar() {
    this.router.navigate(['/admin']); 
  }
}
