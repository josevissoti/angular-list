const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Produtos',
      version: '1.0.0',
      description: 'API para CRUD de produtos com Swagger',
    },
    servers: [{ url: 'http://localhost:8080' }],
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint para JSON do Swagger
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

// Health check
app.get('/health', (_req, res) => res.send('ok'));

// Dados em memória
let produtos = [
  { id: 1, descricao: 'Teclado Mecânico', preco: 199.9 },
  { id: 2, descricao: 'Mouse', preco: 59.9 },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         descricao:
 *           type: string
 *           example: "Teclado Mecânico"
 *         preco:
 *           type: number
 *           example: 199.9
 *     ProdutoInput:
 *       type: object
 *       required:
 *         - descricao
 *         - preco
 *       properties:
 *         descricao:
 *           type: string
 *           example: "Headset Gamer"
 *         preco:
 *           type: number
 *           example: 299.9
 */

/**
 * @swagger
 * tags:
 *   - name: Produtos
 *     description: CRUD de Produtos
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 */
app.get('/produtos', (_req, res) => res.json(produtos));

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Obtém um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
app.get('/produtos/:id', (req, res) => {
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(produto);
});

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 */
app.post('/produtos', (req, res) => {
  const { descricao, preco } = req.body;
  if (!descricao || preco === undefined) {
    return res.status(400).json({ error: 'Descrição e preço são obrigatórios' });
  }

  const novoProduto = {
    id: Date.now(),
    descricao,
    preco: parseFloat(preco)
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
app.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);
  
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });

  const { descricao, preco } = req.body;
  if (!descricao || preco === undefined) {
    return res.status(400).json({ error: 'Descrição e preço são obrigatórios' });
  }

  produtos[index] = { id, descricao, preco: parseFloat(preco) };
  res.json(produtos[index]);
});

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = produtos.length;
  
  produtos = produtos.filter(p => p.id !== id);
  
  if (produtos.length === initialLength) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  
  res.status(204).send();
});

// Rota simples de teste
app.get('/hello', (_req, res) => res.json({ msg: 'hello world' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`OpenAPI JSON: http://localhost:${PORT}/api-docs.json`);
});