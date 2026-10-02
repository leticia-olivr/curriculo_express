const { pool } = require('../database/connection');

const columns = `
  id,
  pessoa_id,
  nome,
  instituicao,
  data_conclusao,
  validade,
  url
`;

const pessoaExists = async (pessoaId) => {
  const { rowCount } = await pool.query(
    'SELECT id FROM pessoas WHERE id = $1',
    [pessoaId],
  );

  return rowCount > 0;
};

const create = async (certificacao) => {
  const { rows } = await pool.query(
    `INSERT INTO certificacoes (
       pessoa_id, nome, instituicao, data_conclusao, validade, url
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${columns}`,
    [
      certificacao.pessoa_id,
      certificacao.nome,
      certificacao.instituicao,
      certificacao.data_conclusao,
      certificacao.validade,
      certificacao.url,
    ],
  );

  return rows[0];
};

const findAll = async () => {
  const { rows } = await pool.query(`SELECT ${columns} FROM certificacoes ORDER BY id`);
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${columns} FROM certificacoes WHERE id = $1`,
    [id],
  );

  return rows[0] || null;
};

const update = async (id, certificacao) => {
  const { rows } = await pool.query(
    `UPDATE certificacoes
     SET pessoa_id = $1,
         nome = $2,
         instituicao = $3,
         data_conclusao = $4,
         validade = $5,
         url = $6
     WHERE id = $7
     RETURNING ${columns}`,
    [
      certificacao.pessoa_id,
      certificacao.nome,
      certificacao.instituicao,
      certificacao.data_conclusao,
      certificacao.validade,
      certificacao.url,
      id,
    ],
  );

  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM certificacoes WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = { pessoaExists, create, findAll, findById, update, remove };