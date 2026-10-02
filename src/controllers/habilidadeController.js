const habilidadeRepository = require('../models/habilidadeRepository');

const maxBigInt = 9223372036854775807n;
const allowedFields = new Set(['pessoa_id', 'nome', 'nivel', 'categoria']);

const normalizeId = (value) => {
  if (typeof value === 'number' && Number.isSafeInteger(value)) {
    value = String(value);
  }
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return null;
  }
  return BigInt(value) <= maxBigInt ? value : null;
};

const normalizeNullableText = (value, field, maxLength) => {
  if (value === undefined || value === null) {
    return { value: null };
  }
  if (typeof value !== 'string') {
    return { error: `O campo ${field} deve ser um texto ou nulo.` };
  }
  if (value.trim().length > maxLength) {
    return { error: `O campo ${field} deve ter no máximo ${maxLength} caracteres.` };
  }
  return { value: value.trim() || null };
};

const normalizeHabilidade = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'O corpo da requisição deve ser um objeto JSON.' };
  }
  const unknownField = Object.keys(body).find((field) => !allowedFields.has(field));
  if (unknownField) {
    return { error: `Campo não permitido: ${unknownField}.` };
  }

  const pessoaId = normalizeId(body.pessoa_id);
  if (!pessoaId) {
    return { error: 'pessoa_id deve ser um inteiro positivo válido.' };
  }
  if (typeof body.nome !== 'string' || !body.nome.trim()) {
    return { error: 'O campo nome é obrigatório e deve ser um texto.' };
  }
  if (body.nome.trim().length > 150) {
    return { error: 'O campo nome deve ter no máximo 150 caracteres.' };
  }

  const nivel = normalizeNullableText(body.nivel, 'nivel', 50);
  const categoria = normalizeNullableText(body.categoria, 'categoria', 100);
  if (nivel.error) {
    return nivel;
  }
  if (categoria.error) {
    return categoria;
  }

  return {
    habilidade: {
      pessoa_id: pessoaId,
      nome: body.nome.trim(),
      nivel: nivel.value,
      categoria: categoria.value,
    },
  };
};

const isValidRouteId = (id) => normalizeId(id) !== null;

const handleError = (res, error) => {
  if (error.code === '23503') {
    return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
  }
  if (error.code === '23505') {
    return res.status(409).json({ error: 'Esta habilidade já está cadastrada para a pessoa.' });
  }
  console.error('Erro no CRUD de habilidade:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
};

const create = async (req, res) => {
  const result = normalizeHabilidade(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  try {
    if (!(await habilidadeRepository.pessoaExists(result.habilidade.pessoa_id))) {
      return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
    }
    return res.status(201).json(await habilidadeRepository.create(result.habilidade));
  } catch (error) {
    return handleError(res, error);
  }
};

const findAll = async (req, res) => {
  try {
    return res.status(200).json(await habilidadeRepository.findAll());
  } catch (error) {
    return handleError(res, error);
  }
};

const findById = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }
  try {
    const habilidade = await habilidadeRepository.findById(req.params.id);
    if (!habilidade) {
      return res.status(404).json({ error: 'Habilidade não encontrada.' });
    }
    return res.status(200).json(habilidade);
  } catch (error) {
    return handleError(res, error);
  }
};

const update = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }
  const result = normalizeHabilidade(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  try {
    if (!(await habilidadeRepository.pessoaExists(result.habilidade.pessoa_id))) {
      return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
    }
    const habilidade = await habilidadeRepository.update(req.params.id, result.habilidade);
    if (!habilidade) {
      return res.status(404).json({ error: 'Habilidade não encontrada.' });
    }
    return res.status(200).json(habilidade);
  } catch (error) {
    return handleError(res, error);
  }
};

const remove = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }
  try {
    if (!(await habilidadeRepository.remove(req.params.id))) {
      return res.status(404).json({ error: 'Habilidade não encontrada.' });
    }
    return res.status(200).json({ message: 'Habilidade removida com sucesso.' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { create, findAll, findById, update, remove };