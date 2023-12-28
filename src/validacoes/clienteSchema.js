const Joi = require('joi');

const clienteSchema = Joi.object({
    nome: Joi.string().required().messages({
        'any.required': 'O nome é obrigatório.',
        'string.empty': 'O nome é obrigatório.'
    }),
    email: Joi.string().required().messages({
        'any.required': 'O campo E-mail é obrigatório.',
        'string.email': 'E-mail inválido',
        'string.any': 'O campo E-mail é obrigatório'
    }),
    cpf: Joi.string().min(11).max(11).required().messages({
        'any.required': 'O campo cpf é obrigatório',
        'string.empty': 'O campo cpf é obrigatório',
        'string.base': "cpf inválido",
        'string.max': "cpf precisa ser menor ou igual a 8 caracteres."
    }),
    cep: Joi.string().min(8).max(8).messages({
        'string.base': "cep inválido",
        'string.max': "cep precisa ser menor ou igual a 8 caracteres." 
    })
});

module.exports = clienteSchema;