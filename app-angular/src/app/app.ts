import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProdutosComponent } from './pages/produtos/produtos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProdutosComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🛍️ Sistema de Produtos</h1>
      </header>
      <main class="app-main">
        <app-produtos></app-produtos>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .app-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 20px;
      text-align: center;
      color: white;
    }
    
    .app-main {
      padding: 20px;
    }
  `]
})
export class App {
  title = 'app-angular';
}