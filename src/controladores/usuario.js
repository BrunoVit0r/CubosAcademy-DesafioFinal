const bcrypt = require('bcrypt')
const knex = require('../config/conexao')
const usuarioSchema = require('../validacoes/usuarioSchema')

const cadastrarUsuario = async (req, res) => {
    const { nome , email, senha } = req.body

    try {
        await usuarioSchema.validateAsync(req.body)
        
        const usuarioEncontrado = await knex('usuarios').where('email', email).first()

        if (usuarioEncontrado) {
            return res.status(400).json('E-mail já cadastrado')
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoUsuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada }).returning(['id', 'nome', 'email'])

        return res.status(201).json(novoUsuario)
    }
    catch (error) {
        return res.status(400).json({mensagem: error.message})
    }
}

const detalharUsuario = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        
       const usuario = await knex('usuarios')
            .select('id', 'nome', 'email') 
            .where({ id: usuarioId })
            .first();

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({mensagem: 'Erro interno do servidor.'});
    }
};

const atualizarUsuario = async (req, res) => {
   const {nome, email, senha} = req.body
                           
try {
    await usuarioSchema.validateAsync(req.body)

    const verificaEmail = await knex('usuarios').where({email}).where('id', '<>', req.usuario.id).first();
    
    if (verificaEmail) {
        return res.status(400).json({mensagem: 'Email já cadastrado'})
    };

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const usuarioAtualizado = {
        nome,
        email,
        senha: senhaCriptografada
    }

    const query = await knex('usuarios').update(usuarioAtualizado).where({id: req.usuario.id}).returning(['id', 'nome', 'email'])
    return res.status(200).json(query)
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }
}

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
};
