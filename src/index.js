const express = require('express');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config();

const app = express();
const rotas = require('./rotas');
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(rotas);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


