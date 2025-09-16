import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutosService, Produto, ProdutoInput } from '../../core/produtos.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  private produtosService = inject(ProdutosService);

  produtos: Produto[] = [];
  carregando = false;
  erro = '';
  modoEdicao = false;
  produtoEditando: Produto | null = null;
  novoProduto: ProdutoInput = { descricao: '', preco: 0 };

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';
    
    this.produtosService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar produtos';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }

  criarProduto(): void {
    if (!this.novoProduto.descricao || this.novoProduto.preco <= 0) {
      this.erro = 'Descrição e preço são obrigatórios';
      return;
    }

    this.produtosService.criar(this.novoProduto).subscribe({
      next: () => {
        this.novoProduto = { descricao: '', preco: 0 };
        this.carregarProdutos();
      },
      error: (erro) => {
        this.erro = 'Erro ao criar produto';
        console.error('Erro:', erro);
      }
    });
  }

  iniciarEdicao(produto: Produto): void {
    this.modoEdicao = true;
    this.produtoEditando = { ...produto };
  }

  salvarEdicao(): void {
    if (!this.produtoEditando) return;

    this.produtosService.atualizar(this.produtoEditando.id, {
      descricao: this.produtoEditando.descricao,
      preco: this.produtoEditando.preco
    }).subscribe({
      next: () => {
        this.cancelarEdicao();
        this.carregarProdutos();
      },
      error: (erro) => {
        this.erro = 'Erro ao atualizar produto';
        console.error('Erro:', erro);
      }
    });
  }

  cancelarEdicao(): void {
    this.modoEdicao = false;
    this.produtoEditando = null;
  }

  excluirProduto(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    this.produtosService.excluir(id).subscribe({
      next: () => {
        this.carregarProdutos();
      },
      error: (erro) => {
        this.erro = 'Erro ao excluir produto';
        console.error('Erro:', erro);
      }
    });
  }
}