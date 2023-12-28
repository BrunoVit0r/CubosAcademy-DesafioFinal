const Joi = require('joi');

const pedidoSchema = Joi.object({
    cliente_id: Joi.number().integer().positive().required().messages({
    'any.required': 'É necessário informar o ID do Cliente.',
    'number.positive': 'É necessário informar o ID do Cliente.',
    'number.base': 'É necessário informar o ID do Cliente.'
    }),
  observacao: Joi.string(),
  pedido_produtos: Joi.array().items(
    Joi.object({
        produto_id: Joi.number().integer().positive().required().messages({
            'any.required': 'É necessário ao menos um produto informado.',
            'number.positive': 'É necessário ao menos um produto informado.',
            'number.base': 'É necessário ao menos um produto informado.'
        }),
        quantidade_produto: Joi.number().integer().positive().required().messages({
            'any.required': 'É necessário ao menos um produto informado.',
            'number.positive': 'É necessário ao menos um produto informado.',
            'number.base': 'É necessário ao menos um produto informado.'
        }),
    })
  )
  .min(1)
  .required().messages({
            'array.min': '`pedido_produtos` deve conter pelo menos um produto',
            'any.required': '`pedido_produtos` é um campo obrigatório'
        })
});

module.exports = pedidoSchema;
