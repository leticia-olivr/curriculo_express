require('dotenv').config();

const app = require('./app');
const { testConnection } = require('./database/connection');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
  testConnection();
});