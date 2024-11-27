const express = require('express');
const { port } = require('../config/serverConfig');

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Bot Mongaboss está rodando!</h1>');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;
