const formacaoRepository = require('../models/formacaoRepository');

const textFields = {
  instituicao: 200,
  curso: 200,
  grau: 100,
  status: 50,
};
const allowedFields = new Set([
  'pessoa_id',
  'instituicao',
  'curso',
  'grau',
  'data_inicio',
  'data_fim',
  'status',
  'descricao',
]);
const maxBigInt = 9223372036854775807n;

const normalizeId = (value) => {
  if (typeof value === 'number' && Number.isSafeInteger(value)) {
    value = String(value);
  }

  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  return BigInt(value) <= maxBigInt ? value : null;
};

const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const normalizeFormacao = (body) => {
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

  for (const [field, maxLength] of Object.entries(textFields)) {
    if (typeof body[field] !== 'string' || !body[field].trim()) {
      return { error: `O campo ${field} é obrigatório e deve ser um texto.` };
    }
    if (body[field].trim().length > maxLength) {
      return { error: `O campo ${field} deve ter no máximo ${maxLength} caracteres.` };
    }
  }

  if (!isValidDate(body.data_inicio)) {
    return { error: 'data_inicio deve ser uma data válida no formato AAAA-MM-DD.' };
  }

  const dataFim = body.data_fim ?? null;
  if (dataFim !== null && !isValidDate(dataFim)) {
    return { error: 'data_fim deve ser uma data válida no formato AAAA-MM-DD ou nula.' };
  }
  if (dataFim && dataFim < body.data_inicio) {
    return { error: 'data_fim não pode ser anterior a data_inicio.' };
  }

  if (
    body.descricao !== undefined
    && body.descricao !== null
    && typeof body.descricao !== 'string'
  ) {
    return { error: 'O campo descricao deve ser um texto ou nulo.' };
  }

  return {
    formacao: {
      pessoa_id: pessoaId,
      instituicao: body.instituicao.trim(),
      curso: body.curso.trim(),
      grau: body.grau.trim(),
      data_inicio: body.data_inicio,
      data_fim: dataFim,
      status: body.status.trim(),
      descricao: body.descricao?.trim() || null,
    },
  };
};

const isValidRouteId = (id) => normalizeId(id) !== null;

const handleError = (res, error) => {
  if (error.code === '23503') {
    return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
  }
  if (error.code === '23514' || error.code === '22P02' || error.code === '22003') {
    return res.status(400).json({ error: 'Dados de formação inválidos.' });
  }

  console.error('Erro no CRUD de formação:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
};

const create = async (req, res) => {
  const result = normalizeFormacao(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  try {
    if (!(await formacaoRepository.pessoaExists(result.formacao.pessoa_id))) {
      return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
    }

    const formacao = await formacaoRepository.create(result.formacao);
    return res.status(201).json(formacao);
  } catch (error) {
    return handleError(res, error);
  }
};

const findAll = async (req, res) => {
  try {
    const formacoes = await formacaoRepository.findAll();
    return res.status(200).json(formacoes);
  } catch (error) {
    return handleError(res, error);
  }
};

const findById = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }

  try {
    const formacao = await formacaoRepository.findById(req.params.id);
    if (!formacao) {
      return res.status(404).json({ error: 'Formação não encontrada.' });
    }
    return res.status(200).json(formacao);
  } catch (error) {
    return handleError(res, error);
  }
};

const update = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }

  const result = normalizeFormacao(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  try {
    if (!(await formacaoRepository.pessoaExists(result.formacao.pessoa_id))) {
      return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
    }

    const formacao = await formacaoRepository.update(req.params.id, result.formacao);
    if (!formacao) {
      return res.status(404).json({ error: 'Formação não encontrada.' });
    }
    return res.status(200).json(formacao);
  } catch (error) {
    return handleError(res, error);
  }
};

const remove = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }

  try {
    const removed = await formacaoRepository.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Formação não encontrada.' });
    }
    return res.status(200).json({ message: 'Formação removida com sucesso.' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { create, findAll, findById, update, remove };