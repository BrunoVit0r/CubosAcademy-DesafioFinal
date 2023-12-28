const knex = require('../config/conexao');
const pedidoSchema = require('../validacoes/pedidoSchema');
const transportador = require('../email')

const cadastrarPedido = async (req, res) => {
    try {
        await pedidoSchema.validateAsync(req.body);
        const { observacao, pedido_produtos } = req.body;
        const cliente_id = req.body.cliente_id;
        
        const clienteEncontrado = await knex("clientes").where({ id: cliente_id }).first();
       
        if (!clienteEncontrado) {            
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        let erros = [];
        let valorTotal = 0;

        for (const item of pedido_produtos) {
            let produtoCorrente = await knex('produtos')
                .where('id', '=', item.produto_id)
                .first();

            if (!produtoCorrente) {
                erros.push({
                    mensagem: `Não existe produto para o produto_id informado: ${item.produto_id}`,
                });

                continue;
            }

            if (item.quantidade_produto > produtoCorrente.quantidade_estoque) {
                erros.push({
                    mensagem: `A quantidade solicitada: ${item.quantidade_produto} para o produto de ID: ${produtoCorrente.id} é maior que a quantidade atual em estoque.`
                });

                continue;
            }

            valorTotal += produtoCorrente.valor * item.quantidade_produto;

            item.valor_produto = produtoCorrente.valor;
            item.quantidade_estoque = produtoCorrente.quantidade_estoque;
        }

        if (erros.length > 0) {
            console.log({ erros });
            return res.status(400).json({ erros });
        }

        const pedido = await knex('pedidos')
            .insert({
                cliente_id: cliente_id,
                observacao: observacao,
                valor_total: valorTotal,
            })
            .returning('*');

        for (const item of pedido_produtos) {
            await knex('pedido_produtos')
                .insert({
                    pedido_id: pedido[0].id,
                    produto_id: item.produto_id,
                    quantidade_produto: item.quantidade_produto,
                    valor_produto: item.valor_produto,
                });

            let quantidadeReduzida = item.quantidade_estoque - item.quantidade_produto;

            await knex('produtos')
                .where('id', '=', item.produto_id)
                .update({
                    quantidade_estoque: quantidadeReduzida,
                });
        }

        const cliente = await knex('clientes').where('id', cliente_id).first();

        transportador.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: `${cliente.nome} <${cliente.email}>`,
            subject: "Seu Pedido foi aprovado em nosso PDV",
            text: "Olá, seu pedido foi registrado."
          });
          
        return res.status(201).json({ mensagem: 'Pedido gerado com sucesso' });
    } catch (error) {
        
        return res.status(500).json({ mensagem: error.message });
    }
};

const listarPedido = async (req, res) => {
    const {cliente_id} = req.query;

    try {
        if (cliente_id) {
            const cliente = await knex('clientes').where({id: cliente_id}).first();
            if (!cliente) {return res.status(400).json({mensagem: "cliente informado não existe"})};

            const pedidoPorCliente = await knex('pedidos').where({cliente_id})
            if (!pedidoPorCliente) {return res.status(400).json({mensagem: "o cliente informado não tem pedidos cadastrados"})}

            const resposta = []

            for (let pedido of pedidoPorCliente) {
                const {id} = pedido
                const pedido_produtos = await knex('pedido_produtos').where({pedido_id: id})
                resposta.push({pedido, pedido_produtos})
            }

            return res.status(200).json(resposta)
        }
        
        const pedidos = await knex('pedidos');
        const resposta = [];
        
        for (let pedido of pedidos) {
            const {id} = pedido;
            const pedido_produtos = await knex('pedido_produtos').where({pedido_id: id});
            resposta.push(pedido, pedido_produtos)
        }
        
        return res.status(200).json(resposta)
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({mensagem: "erro interno"})
    }

    
}

module.exports = {
    cadastrarPedido,
    listarPedido
};
