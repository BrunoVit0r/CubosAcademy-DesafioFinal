const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const autenticacaoServico = require('../validacoes/autenticacaoSchema');
const knex = require('../config/conexao');

const gerarToken = async (req, res, next ) => {
    const { email, senha } = req.body;

    try {
        await autenticacaoServico.validateAsync(req.body);

        const usuarioEncontrado = await knex('usuarios').where({ email }).first();

        if (!usuarioEncontrado) {
            return res.status(404).json('E-mail ou senha inválidos');
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaCorreta) {
            return res.status(404).json('E-mail ou senha inválidos');
        }

        const token = jwt.sign({ id: usuarioEncontrado.id }, process.env.JWT_SECRETKEY, { expiresIn: '1d' });

        const { senha: senhaUsuario, ...dadosUsuario } = usuarioEncontrado;

        return res.status(200).json({ usuario: dadosUsuario, token });
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    gerarToken
};