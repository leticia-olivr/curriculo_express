const { pool } = require('../database/connection');

const findByPessoaId = async (pessoaId) => {
  const { rows } = await pool.query(
    `SELECT
       to_jsonb(p) AS pessoa,
       COALESCE((
         SELECT json_agg(to_jsonb(f) ORDER BY f.id)
         FROM formacoes f
         WHERE f.pessoa_id = p.id
       ), '[]'::json) AS formacoes,
       COALESCE((
         SELECT json_agg(to_jsonb(e) ORDER BY e.id)
         FROM experiencias_profissionais e
         WHERE e.pessoa_id = p.id
       ), '[]'::json) AS experiencias,
       COALESCE((
         SELECT json_agg(to_jsonb(pr) ORDER BY pr.id)
         FROM projetos pr
         WHERE pr.pessoa_id = p.id
       ), '[]'::json) AS projetos,
       COALESCE((
         SELECT json_agg(to_jsonb(h) ORDER BY h.id)
         FROM habilidades h
         WHERE h.pessoa_id = p.id
       ), '[]'::json) AS habilidades,
       COALESCE((
         SELECT json_agg(to_jsonb(c) ORDER BY c.id)
         FROM certificacoes c
         WHERE c.pessoa_id = p.id
       ), '[]'::json) AS certificacoes
     FROM pessoas p
     WHERE p.id = $1`,
    [pessoaId],
  );

  return rows[0] || null;
};

module.exports = { findByPessoaId };