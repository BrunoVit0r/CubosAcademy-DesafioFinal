const express = require('express');
const rotas = express.Router();
const multer = require('./multer');

const usuarioControlador = require('./controladores/usuario');
const autenticacaoControlador = require('./controladores/autenticacao');
const clientesControlador = require('./controladores/clientes');

const validarToken = require('./intermediarios/validacaoToken');
const { listarCategorias } = require('./controladores/categorias');
const produtoControlador = require('./controladores/produto');
const pedidoControlador = require('./controladores/pedido');

rotas.post('/usuario', usuarioControlador.cadastrarUsuario);
rotas.post('/login', autenticacaoControlador.gerarToken);
rotas.get('/categoria', listarCategorias);

rotas.use(validarToken);

rotas.get('/usuario', usuarioControlador.detalharUsuario);
rotas.put('/usuario', usuarioControlador.atualizarUsuario);

rotas.post('/cliente', clientesControlador.cadastrarCliente);
rotas.put('/cliente/:id', clientesControlador.atualizarCliente);
rotas.get('/cliente', clientesControlador.listarClientes);
rotas.get('/cliente/:id', clientesControlador.obterCliente);

rotas.post('/produto', multer.single('imagem'), produtoControlador.cadastrarProduto);
rotas.put('/produto/:id', produtoControlador.atualizarProduto);
rotas.get('/produto', produtoControlador.listarProdutos);
rotas.get('/produto/:id', produtoControlador.detalharProduto);
rotas.delete('/produto/:id', produtoControlador.deletarProduto);

rotas.post('/pedido', pedidoControlador.cadastrarPedido);
rotas.get('/pedido', pedidoControlador.listarPedido)

module.exports = rotas;