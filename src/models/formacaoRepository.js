const { pool } = require('../database/connection');

const columns = `
  id,
  pessoa_id,
  instituicao,
  curso,
  grau,
  data_inicio,
  data_fim,
  status,
  descricao
`;

const pessoaExists = async (pessoaId) => {
  const { rowCount } = await pool.query(
    'SELECT id FROM pessoas WHERE id = $1',
    [pessoaId],
  );

  return rowCount > 0;
};

const create = async (formacao) => {
  const { rows } = await pool.query(
    `INSERT INTO formacoes (
       pessoa_id, instituicao, curso, grau, data_inicio, data_fim, status, descricao
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${columns}`,
    [
      formacao.pessoa_id,
      formacao.instituicao,
      formacao.curso,
      formacao.grau,
      formacao.data_inicio,
      formacao.data_fim,
      formacao.status,
      formacao.descricao,
    ],
  );

  return rows[0];
};

const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT ${columns} FROM formacoes ORDER BY id`,
  );

  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${columns} FROM formacoes WHERE id = $1`,
    [id],
  );

  return rows[0] || null;
};

const update = async (id, formacao) => {
  const { rows } = await pool.query(
    `UPDATE formacoes
     SET pessoa_id = $1,
         instituicao = $2,
         curso = $3,
         grau = $4,
         data_inicio = $5,
         data_fim = $6,
         status = $7,
         descricao = $8
     WHERE id = $9
     RETURNING ${columns}`,
    [
      formacao.pessoa_id,
      formacao.instituicao,
      formacao.curso,
      formacao.grau,
      formacao.data_inicio,
      formacao.data_fim,
      formacao.status,
      formacao.descricao,
      id,
    ],
  );

  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM formacoes WHERE id = $1',
    [id],
  );

  return rowCount > 0;
};

module.exports = { pessoaExists, create, findAll, findById, update, remove };