const { pool } = require('../database/connection');

const columns = `
  id,
  pessoa_id,
  nome,
  nivel,
  categoria
`;

const pessoaExists = async (pessoaId) => {
  const { rowCount } = await pool.query(
    'SELECT id FROM pessoas WHERE id = $1',
    [pessoaId],
  );

  return rowCount > 0;
};

const create = async (habilidade) => {
  const { rows } = await pool.query(
    `INSERT INTO habilidades (pessoa_id, nome, nivel, categoria)
     VALUES ($1, $2, $3, $4)
     RETURNING ${columns}`,
    [habilidade.pessoa_id, habilidade.nome, habilidade.nivel, habilidade.categoria],
  );

  return rows[0];
};

const findAll = async () => {
  const { rows } = await pool.query(`SELECT ${columns} FROM habilidades ORDER BY id`);
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${columns} FROM habilidades WHERE id = $1`,
    [id],
  );

  return rows[0] || null;
};

const update = async (id, habilidade) => {
  const { rows } = await pool.query(
    `UPDATE habilidades
     SET pessoa_id = $1,
         nome = $2,
         nivel = $3,
         categoria = $4
     WHERE id = $5
     RETURNING ${columns}`,
    [habilidade.pessoa_id, habilidade.nome, habilidade.nivel, habilidade.categoria, id],
  );

  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM habilidades WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = { pessoaExists, create, findAll, findById, update, remove };