const { pool } = require('../database/connection');

const columns = `
  id,
  pessoa_id,
  nome,
  descricao,
  tecnologias,
  url,
  repositorio,
  data_inicio,
  data_fim
`;

const pessoaExists = async (pessoaId) => {
  const { rowCount } = await pool.query(
    'SELECT id FROM pessoas WHERE id = $1',
    [pessoaId],
  );

  return rowCount > 0;
};

const create = async (projeto) => {
  const { rows } = await pool.query(
    `INSERT INTO projetos (
       pessoa_id, nome, descricao, tecnologias, url, repositorio, data_inicio, data_fim
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${columns}`,
    [
      projeto.pessoa_id,
      projeto.nome,
      projeto.descricao,
      projeto.tecnologias,
      projeto.url,
      projeto.repositorio,
      projeto.data_inicio,
      projeto.data_fim,
    ],
  );

  return rows[0];
};

const findAll = async () => {
  const { rows } = await pool.query(`SELECT ${columns} FROM projetos ORDER BY id`);
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${columns} FROM projetos WHERE id = $1`,
    [id],
  );

  return rows[0] || null;
};

const update = async (id, projeto) => {
  const { rows } = await pool.query(
    `UPDATE projetos
     SET pessoa_id = $1,
         nome = $2,
         descricao = $3,
         tecnologias = $4,
         url = $5,
         repositorio = $6,
         data_inicio = $7,
         data_fim = $8
     WHERE id = $9
     RETURNING ${columns}`,
    [
      projeto.pessoa_id,
      projeto.nome,
      projeto.descricao,
      projeto.tecnologias,
      projeto.url,
      projeto.repositorio,
      projeto.data_inicio,
      projeto.data_fim,
      id,
    ],
  );

  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM projetos WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = { pessoaExists, create, findAll, findById, update, remove };