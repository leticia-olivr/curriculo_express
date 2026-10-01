const express = require('express');
const pessoaRoutes = require('./routes/pessoaRoutes');
const formacaoRoutes = require('./routes/formacaoRoutes');
const experienciaRoutes = require('./routes/experienciaRoutes');

const app = express();

app.use(express.json());
app.use('/api/pessoas', pessoaRoutes);
app.use('/api/formacoes', formacaoRoutes);
app.use('/api/experiencias', experienciaRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API Curriculo Express funcionando.',
  });
});

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Corpo JSON inválido.' });
  }

  console.error('Erro não tratado na API:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.use((req, res) => {
  return res.status(404).json({ error: 'Rota não encontrada.' });
});

module.exports = app;