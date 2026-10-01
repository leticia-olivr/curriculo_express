const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const testConnection = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('Conexão PostgreSQL não testada: DATABASE_URL não configurada.');
    return false;
  }

  try {
    await pool.query('SELECT 1');
    console.log('Conexão com PostgreSQL estabelecida.');
    return true;
  } catch (error) {
    console.error(`Falha ao conectar ao PostgreSQL: ${error.message}`);
    return false;
  }
};

module.exports = { pool, testConnection };