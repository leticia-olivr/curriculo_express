const { pool } = require('../database/connection');

const columns = `
  id,
  nome,
  email,
  telefone,
  cidade,
  estado,
  resumo,
  linkedin,
  github,
  created_at
`;

const create = async (pessoa) => {
  const { rows } = await pool.query(
    `INSERT INTO pessoas (nome, email, telefone, cidade, estado, resumo, linkedin, github)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${columns}`,
    [
      pessoa.nome,
      pessoa.email,
      pessoa.telefone,
      pessoa.cidade,
      pessoa.estado,
      pessoa.resumo,
      pessoa.linkedin,
      pessoa.github,
    ],
  );

  return rows[0];
};

const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT ${columns} FROM pessoas ORDER BY id`,
  );

  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${columns} FROM pessoas WHERE id = $1`,
    [id],
  );

  return rows[0] || null;
};

const update = async (id, pessoa) => {
  const { rows } = await pool.query(
    `UPDATE pessoas
     SET nome = $1,
         email = $2,
         telefone = $3,
         cidade = $4,
         estado = $5,
         resumo = $6,
         linkedin = $7,
         github = $8
     WHERE id = $9
     RETURNING ${columns}`,
    [
      pessoa.nome,
      pessoa.email,
      pessoa.telefone,
      pessoa.cidade,
      pessoa.estado,
      pessoa.resumo,
      pessoa.linkedin,
      pessoa.github,
      id,
    ],
  );

  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM pessoas WHERE id = $1',
    [id],
  );

  return rowCount > 0;
};

module.exports = { create, findAll, findById, update, remove };