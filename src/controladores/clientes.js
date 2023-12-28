const clienteSchema = require('../validacoes/clienteSchema');
const knex = require('../config/conexao');

const cadastrarCliente = async (req, res) => {
    const {nome, email, cpf, cep, rua, numero, bairro, cidade, estado} = req.body;

    try {
        await clienteSchema.validateAsync({nome, email, cpf, cep});

        const verificarEmail = await knex("clientes").where("email", "=", email).andWhere("id", "<>", id);
        const verificarCpf = await knex("clientes").where("cpf", "=", cpf).andWhere("id", "<>", id);

       if (verificarEmail.length > 0) {
            return res.status(400).json({ mensagem: "Este email já está cadastrado." });
        }

       if (verificarCpf.length > 0) {
           return res.status(400).json({ mensagem: "Este CPF já está cadastrado." });
       }

        const novoCliente = await knex('clientes').insert({nome, email, cpf, cep, rua, numero, bairro, cidade, estado}).returning('*');

        return res.status(201).json(novoCliente);
    } catch (error) {
        return res.status(500).json({mensagem: error.message});
    }
}

const atualizarCliente = async (req, res) => {
    const {id} = req.params;
    const {nome, email, cpf, cep, rua, numero, bairro, cidade, estado} = req.body;


    try {
        await clienteSchema.validateAsync({nome, email, cpf, cep});

        const cliente = await knex('clientes').where('id', id).first();

        if(!cliente) return res.status(400).json("Cliente não encontrado");

        const clienteAtualizado = await knex('clientes').update({nome, email, cpf, cep, rua, numero, bairro, cidade, estado}).where('id', id).returning('*');

        return res.status(200).json(clienteAtualizado);
        
    } catch (error) {
        return res.status(500).json({mensagem: error.message});
    }
}

const listarClientes = async (req, res) => {
    try {
        const clientes = await knex('clientes');

        return res.status(200).json(clientes)
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }
}

const obterCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const cliente = await knex('clientes').where('id', id).first();

        if(!cliente) return res.status(400).json("Cliente não encontrado");

        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(500).json({mensagem: error.message});
    }
}


module.exports = {
    cadastrarCliente,
    atualizarCliente,
    listarClientes,
    obterCliente
}