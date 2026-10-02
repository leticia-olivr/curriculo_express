const certificacaoRepository = require('../models/certificacaoRepository');

const maxBigInt = 9223372036854775807n;
const allowedFields = new Set([
  'pessoa_id',
  'nome',
  'instituicao',
  'data_conclusao',
  'validade',
  'url',
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

const normalizeCertificacao = (body) => {
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
  for (const [field, maxLength] of [['nome', 200], ['instituicao', 200]]) {
    if (typeof body[field] !== 'string' || !body[field].trim()) {
      return { error: `O campo ${field} é obrigatório e deve ser um texto.` };
    }
    if (body[field].trim().length > maxLength) {
      return { error: `O campo ${field} deve ter no máximo ${maxLength} caracteres.` };
    }
  }

  const dataConclusao = body.data_conclusao ?? null;
  const validade = body.validade ?? null;
  for (const [field, value] of [['data_conclusao', dataConclusao], ['validade', validade]]) {
    if (value !== null && !isValidDate(value)) {
      return { error: `${field} deve ser uma data válida no formato AAAA-MM-DD ou nula.` };
    }
  }
  if (dataConclusao && validade && validade < dataConclusao) {
    return { error: 'validade não pode ser anterior a data_conclusao.' };
  }

  const url = body.url ?? null;
  if (url !== null && typeof url !== 'string') {
    return { error: 'O campo url deve ser um texto ou nulo.' };
  }

  return {
    certificacao: {
      pessoa_id: pessoaId,
      nome: body.nome.trim(),
      instituicao: body.instituicao.trim(),
      data_conclusao: dataConclusao,
      validade,
      url: typeof url === 'string' ? url.trim() || null : null,
    },
  };
};

const isValidRouteId = (id) => normalizeId(id) !== null;

const handleError = (res, error) => {
  if (error.code === '23503') {
    return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
  }
  if (error.code === '23514' || error.code === '22P02' || error.code === '22003') {
    return res.status(400).json({ error: 'Dados de certificação inválidos.' });
  }
  console.error('Erro no CRUD de certificação:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
};

const create = async (req, res) => {
  const result = normalizeCertificacao(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  try {
    if (!(await certificacaoRepository.pessoaExists(result.certificacao.pessoa_id))) {
      return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
    }
    return res.status(201).json(await certificacaoRepository.create(result.certificacao));
  } catch (error) {
    return handleError(res, error);
  }
};

const findAll = async (req, res) => {
  try {
    return res.status(200).json(await certificacaoRepository.findAll());
  } catch (error) {
    return handleError(res, error);
  }
};

const findById = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }
  try {
    const certificacao = await certificacaoRepository.findById(req.params.id);
    if (!certificacao) {
      return res.status(404).json({ error: 'Certificação não encontrada.' });
    }
    return res.status(200).json(certificacao);
  } catch (error) {
    return handleError(res, error);
  }
};

const update = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }
  const result = normalizeCertificacao(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  try {
    if (!(await certificacaoRepository.pessoaExists(result.certificacao.pessoa_id))) {
      return res.status(404).json({ error: 'Pessoa informada não encontrada.' });
    }
    const certificacao = await certificacaoRepository.update(req.params.id, result.certificacao);
    if (!certificacao) {
      return res.status(404).json({ error: 'Certificação não encontrada.' });
    }
    return res.status(200).json(certificacao);
  } catch (error) {
    return handleError(res, error);
  }
};

const remove = async (req, res) => {
  if (!isValidRouteId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }
  try {
    if (!(await certificacaoRepository.remove(req.params.id))) {
      return res.status(404).json({ error: 'Certificação não encontrada.' });
    }
    return res.status(200).json({ message: 'Certificação removida com sucesso.' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { create, findAll, findById, update, remove };