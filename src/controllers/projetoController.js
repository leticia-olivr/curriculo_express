const projetoRepository = require('../models/projetoRepository');

const maxBigInt = 9223372036854775807n;
const allowedFields = new Set([
  'pessoa_id',
  'nome',
  'descricao',
  'tecnologias',
  'url',
  'repositorio',
  'data_inicio',
  'data_fim',
]);

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

const normalizeOptionalText = (body, field) => {
  const value = body[field];
  if (value === undefined || value === null) {
    return { value: null };
  }
  if (typeof value !== 'string') {
    return { error: `O campo ${field} deve ser um texto ou nulo.` };
  }
  return { value: value.trim() || null };
};

const normalizeProjeto = (body) => {
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
  if (body.nome.trim().length > 200) {
    return { error: 'O campo nome deve ter no máximo 200 caracteres.' };
  }

  const tecnologias = body.tecnologias ?? [];
  if (!Array.isArray(tecnologias) || tecnologias.some((item) => typeof item !== 'string')) {
    return { error: 'O campo tecnologias deve ser uma lista de textos.' };
  }

  const dataInicio = body.data_inicio ?? null;
  const dataFim = body.data_fim ?? null;
  if (dataInicio !== null && !isValidDate(dataInicio)) {
    return { error: 'data_inicio deve ser uma data válida no formato AAAA-MM-DD ou nula.' };
  }
  if (dataFim !== null && !isValidDate(dataFim)) {
    return { error: 'data_fim deve ser uma data válida no formato AAAA-MM-DD ou nula.' };
  }
  if (dataInicio && dataFim && dataFim < dataInicio) {
    return { error: 'data_fim não pode ser anterior a data_inicio.' };
  }

  const descricao = normalizeOptionalText(body, 'descricao');
  const url = normalizeOptionalText(body, 'url');
  const repositorio = normalizeOptionalText(body, 'repositorio');
  for (const result of [descricao, url, repositorio]) {
    if (result.error) {
      return result;
    }
  }

  return {
    projeto: {
      pessoa_id: pessoaId,
      nome: body.nome.trim(),
      descricao: descricao.value,
      tecnologias: tecnologias.map((item) => item.trim()).filter(Boolean),
      url: url.value,
      repositorio: repositorio.value,
      data_inicio: dataInicio,
      data_fim: dataFim,
    },
  };
};

const isValidRouteId = (id) => normalizeId(id) !== null;

const handleError = (res, error) => {
  if (error.code === '23503') {
    return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
  }
  if (error.code === '23514' || error.code === '22P02' || error.code === '22003') {
    return res.status(400).json({ error: 'Dados de projeto inválidos.' });
  }
  console.error('Erro no CRUD de projeto:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
};

const create = async (req, res) => {
  const result = normalizeProjeto(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  try {
    if (!(await projetoRepository.pessoaExists(result.projeto.pessoa_id))) {
      return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
    }
    return res.status(201).json(await projetoRepository.create(result.projeto));
  } catch (error) {
    return handleError(res, error);
  }
};

const findAll = async (req, res) => {
  try {
    return res.status(200).json(await projetoRepository.findAll());
  } catch (error) {
    return handleError(res, error);
  }
};

const findById = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }
  try {
    const projeto = await projetoRepository.findById(req.params.id);
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    return res.status(200).json(projeto);
  } catch (error) {
    return handleError(res, error);
  }
};

const update = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }
  const result = normalizeProjeto(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  try {
    if (!(await projetoRepository.pessoaExists(result.projeto.pessoa_id))) {
      return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
    }
    const projeto = await projetoRepository.update(req.params.id, result.projeto);
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    return res.status(200).json(projeto);
  } catch (error) {
    return handleError(res, error);
  }
};

const remove = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }
  try {
    if (!(await projetoRepository.remove(req.params.id))) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    return res.status(200).json({ message: 'Projeto removido com sucesso.' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { create, findAll, findById, update, remove };