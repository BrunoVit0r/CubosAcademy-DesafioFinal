const knex = require('../config/conexao')

const listarCategorias = async (req, res, next) => {
    try {
        const listaCategoria = await knex('categorias').select('*');

        return res.status(200).json(listaCategoria);
    } catch (erro) {
        return res.status(401).json({ mensagem: 'Categoria não encontrada.'});
    }   
}

module.exports = {
    listarCategorias
};