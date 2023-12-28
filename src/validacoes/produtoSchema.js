const Joi = require('joi');

const produtoSchema = Joi.object({
    categoria_id: Joi.number().integer().min(1).required().messages({
        'any.required': 'A categoria é obrigatória.',
        'number.positive': 'A categoria precisa ser positiva.',
        'string.empty': 'A categoria é obrigatória.'
    }),
    descricao: Joi.string().required().messages({
        'any.required': 'A descrição é obrigatória.',
        'string.empty': 'A descrição é obrigatória.'
    }),
    quantidade_estoque: Joi.number().integer().min(0).positive().required().messages({
        'any.required': 'A quantidade é obrigatória.',
        'number.positive': 'A quantidade precisa ser positiva.',
        'number.base': 'A quantidade é obrigatória.'
    }),

    valor: Joi.number().integer().min(0).positive().required().messages({
        'any.required': 'O valor é obrigatório.',
        'number.positive': 'O valor precisa ser positivo.',
        'number.base': 'O valor é obrigatório.'
    })
});

module.exports = produtoSchema;


