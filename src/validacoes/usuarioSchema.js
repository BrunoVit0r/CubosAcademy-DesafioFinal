const Joi = require('joi');

const usuarioSchema = Joi.object({
    nome: Joi.string().required().messages({
        'any.required': 'O nome é obrigatório.',
        'string.empty': 'O nome é obrigatório.'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'O email é obrigatório.',
        'string.email': 'O email precisa ter um formato válido.',
        'string.empty': 'O email é obrigatório.'
    }),

    senha: Joi.string().min(5).required().messages({
        'any.required': 'A senha é obrigatória.',
        'string.min': 'A senha precisa conter, no mínimo, 5 caracteres.',
        'string.empty': 'A senha é obrigatória.'
    }),
});

module.exports = usuarioSchema;
