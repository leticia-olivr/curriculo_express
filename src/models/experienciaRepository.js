const { pool } = require('../database/connection');

const columns = `
  id,
  pessoa_id,
  empresa,
  cargo,
  data_inicio,
  data_fim,
  atual,
  descricao
`;

const pessoaExists = async (pessoaId) => {
  const { rowCount } = await pool.query(
    'SELECT id FROM pessoas WHERE id = $1',
    [pessoaId],
  );

  return rowCount > 0;
};

const create = async (experiencia) => {
  const { rows } = await pool.query(
    `INSERT INTO experiencias_profissionais (
       pessoa_id, empresa, cargo, data_inicio, data_fim, atual, descricao
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${columns}`,
    [
      experiencia.pessoa_id,
      experiencia.empresa,
      experiencia.cargo,
      experiencia.data_inicio,
      experiencia.data_fim,
      experiencia.atual,
      experiencia.descricao,
    ],
  );

  return rows[0];
};

const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT ${columns} FROM experiencias_profissionais ORDER BY id`,
  );

  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${columns} FROM experiencias_profissionais WHERE id = $1`,
    [id],
  );

  return rows[0] || null;
};

const update = async (id, experiencia) => {
  const { rows } = await pool.query(
    `UPDATE experiencias_profissionais
     SET pessoa_id = $1,
         empresa = $2,
         cargo = $3,
         data_inicio = $4,
         data_fim = $5,
         atual = $6,
         descricao = $7
     WHERE id = $8
     RETURNING ${columns}`,
    [
      experiencia.pessoa_id,
      experiencia.empresa,
      experiencia.cargo,
      experiencia.data_inicio,
      experiencia.data_fim,
      experiencia.atual,
      experiencia.descricao,
      id,
    ],
  );

  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM experiencias_profissionais WHERE id = $1',
    [id],
  );

  return rowCount > 0;
};

module.exports = { pessoaExists, create, findAll, findById, update, remove };