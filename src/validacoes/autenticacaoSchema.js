const Joi = require('joi');

const autenticacaoSchema = Joi.object({
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

module.exports = autenticacaoSchema;
