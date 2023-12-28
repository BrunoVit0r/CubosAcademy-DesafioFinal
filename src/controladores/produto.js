const produtoSchema = require('../validacoes/produtoSchema');
const knex = require('../config/conexao');
const { uploadArquivo, deletarArquivo } = require('../storage/produto');

const cadastrarProduto = async (req, res) => {
    const { file } = req;
    const { categoria_id, descricao, quantidade_estoque, valor} = req.body;
    
    try {
        await produtoSchema.validateAsync(req.body);
        
        const categoriaExiste = await knex('categorias').where('id', categoria_id).first();

        if (!categoriaExiste) {
            return res.status(400).json({ mensagem: 'Categoria informada não existe.' });
        }
        
        if(file) {
            const imagem = await uploadArquivo(file.originalname, file.buffer, file.mimetype);
            
            const novoProduto = await knex('produtos').insert({
                categoria_id,
                descricao,
                quantidade_estoque,
                valor,
                produto_imagem: imagem.url
            }).returning('*');

            return res.status(201).json(novoProduto)
        }

        const novoProduto = await knex('produtos').insert({
            categoria_id,
            descricao,
            quantidade_estoque,
            valor,
        }).returning('*');
            
        return res.status(201).json(novoProduto);
        
    } catch (error) {
        return res.status(500).json({mensagem: error.message});
    }
}

const atualizarProduto = async (req, res) => {
    const {id} = req.params;
    const { file } = req;
    const { categoria_id, descricao, quantidade_estoque, valor  } = req.body;

    try {
        await produtoSchema.validateAsync(req.body);

        const categoriaExiste = await knex('categorias').where('id', categoria_id).first();

        if (!categoriaExiste) {
            return res.status(400).json({ mensagem: 'Categoria informada não existe.' });
        }

        const produtoExiste = await knex('produtos').where('id', id).first();

        if (!produtoExiste) {
            return res.status(400).json({ mensagem: 'Produto informado não existe.' });
        }

        if(file) {
            const imagem = await uploadArquivo(file.originalname, file.buffer, file.mimetype);
            
            const novoProduto = await knex('produtos')
                .update({ categoria_id, descricao, quantidade_estoque, valor, produto_imagem: imagem.url})
                .where('id', id).returning('*');

            return res.status(201).json(novoProduto);
        }

        const produtoAtualizado = await knex('produtos')
        .update({categoria_id, descricao, quantidade_estoque, valor})
        .where('id', id).returning('*');

        return res.status(200).json(produtoAtualizado);
        
    } catch (error) {
        return res.status(500).json({mensagem: error.message});
    }
}

const deletarProduto = async (req, res) => {
    const {id} = req.params;

    try {
        const produto = await knex('produtos').where('id', id).first();

        if (!produto) {
            return res.status(400).json({ mensagem: 'Produto informado não existe.' });
        }

        const produtoSolicitado = await knex('pedido_produtos').where({produto_id: id}).first();

        if (produtoSolicitado) {
            return res.status(400).json({mensagem: 'Produto vinculado a um pedido em aberto'});
        }

        if (produto.produto_imagem) {
            const key = produto.produto_imagem.replace(`https://${process.env.BUCKET_NAME}.${process.env.ENDPOINT_S3}/`, '');

            await deletarArquivo(key);
        }

        await knex('produtos').where('id', id).del();

        return res.status(200).json({ mensagem: 'Produto deletado com sucesso.' });
        
    } catch (error) {
        return res.status(500).json({mensagem: error.message});
    }
}

const listarProdutos = async (req, res) => {
    try {
        const { categoria_id } = req.query;

        const query = categoria_id
            ? knex('produtos').select('*').where('categoria_id', categoria_id)
            : knex('produtos').select('*');

        const produtos = await query;

        return res.status(200).json(produtos);
        
    } catch (error) {
        return res.status(500).json({mensagem: error.message});
    }
}

const detalharProduto = async (req, res) => {
    const {id} = req.params;

    try {
        const produto = await knex('produtos').where('id', id).first();

        if (!produto) {
            return res.status(400).json({ mensagem: 'Produto informado não existe.' });
        }

        return res.status(200).json(produto);
        
    } catch (error) {
        return res.status(500).json({mensagem: error.message});
    }
}

module.exports = {
    cadastrarProduto, 
    atualizarProduto,
    deletarProduto,
    listarProdutos,
    detalharProduto
};