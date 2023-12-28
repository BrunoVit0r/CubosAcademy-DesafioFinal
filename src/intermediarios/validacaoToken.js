const jwt = require('jsonwebtoken');


const validarToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Token não encontrado' });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();
        const usuario = jwt.verify(token, process.env.JWT_SECRETKEY);

        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

module.exports = validarToken;
