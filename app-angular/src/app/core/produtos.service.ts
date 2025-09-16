import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Produto {
  id: number;
  descricao: string;
  preco: number;
}

export interface ProdutoInput {
  descricao: string;
  preco: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = `Erro ${error.status}: ${error.message}`;
      
      if (error.status === 0) {
        errorMessage = 'Não foi possível conectar com o servidor. Verifique se a API está rodando.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado';
      }
    }
    
    console.error('Erro na requisição:', error);
    return throwError(() => new Error(errorMessage));
  }

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/produtos`)
      .pipe(catchError(this.handleError));
  }

  obterPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/produtos/${id}`)
      .pipe(catchError(this.handleError));
  }

  criar(produto: ProdutoInput): Observable<Produto> {
    return this.http.post<Produto>(`${this.baseUrl}/produtos`, produto)
      .pipe(catchError(this.handleError));
  }

  atualizar(id: number, produto: ProdutoInput): Observable<Produto> {
    return this.http.put<Produto>(`${this.baseUrl}/produtos/${id}`, produto)
      .pipe(catchError(this.handleError));
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/produtos/${id}`)
      .pipe(catchError(this.handleError));
  }
}