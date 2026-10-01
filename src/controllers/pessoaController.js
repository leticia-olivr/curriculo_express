const pessoaRepository = require('../models/pessoaRepository');

const fields = {
  nome: 150,
  email: 255,
  telefone: 30,
  cidade: 120,
  estado: 100,
};
const optionalFields = ['telefone', 'cidade', 'estado', 'resumo', 'linkedin', 'github'];
const allowedFields = new Set(['nome', 'email', ...optionalFields]);
const maxBigInt = 9223372036854775807n;

const normalizePessoa = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'O corpo da requisição deve ser um objeto JSON.' };
  }

  const unknownField = Object.keys(body).find((field) => !allowedFields.has(field));
  if (unknownField) {
    return { error: `Campo não permitido: ${unknownField}.` };
  }

  if (typeof body.nome !== 'string' || !body.nome.trim()) {
    return { error: 'O campo nome é obrigatório e deve ser um texto.' };
  }

  if (body.nome.trim().length > fields.nome) {
    return { error: `O campo nome deve ter no máximo ${fields.nome} caracteres.` };
  }

  if (
    typeof body.email !== 'string'
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
  ) {
    return { error: 'Informe um e-mail válido.' };
  }

  if (body.email.trim().length > fields.email) {
    return { error: `O campo email deve ter no máximo ${fields.email} caracteres.` };
  }

  for (const [field, maxLength] of Object.entries(fields)) {
    if (
      field === 'nome'
      || field === 'email'
      || body[field] === undefined
      || body[field] === null
    ) {
      continue;
    }
    if (typeof body[field] !== 'string') {
      return { error: `O campo ${field} deve ser um texto.` };
    }
    if (body[field].trim().length > maxLength) {
      return { error: `O campo ${field} deve ter no máximo ${maxLength} caracteres.` };
    }
  }

  for (const field of optionalFields) {
    if (
      body[field] !== undefined
      && body[field] !== null
      && typeof body[field] !== 'string'
    ) {
      return { error: `O campo ${field} deve ser um texto ou nulo.` };
    }
  }

  return {
    pessoa: {
      nome: body.nome.trim(),
      email: body.email.trim(),
      telefone: body.telefone?.trim() || null,
      cidade: body.cidade?.trim() || null,
      estado: body.estado?.trim() || null,
      resumo: body.resumo?.trim() || null,
      linkedin: body.linkedin?.trim() || null,
      github: body.github?.trim() || null,
    },
  };
};

const isValidId = (id) => {
  if (!/^[1-9]\d*$/.test(id)) {
    return false;
  }

  return BigInt(id) <= maxBigInt;
};

const handleError = (res, error) => {
  if (error.code === '23505') {
    return res.status(400).json({ error: 'Já existe uma pessoa com este e-mail.' });
  }

  console.error('Erro no CRUD de pessoa:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
};

const create = async (req, res) => {
  const result = normalizePessoa(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const pessoa = await pessoaRepository.create(result.pessoa);
    return res.status(201).json(pessoa);
  } catch (error) {
    return handleError(res, error);
  }
};

const findAll = async (req, res) => {
  try {
    const pessoas = await pessoaRepository.findAll();
    return res.status(200).json(pessoas);
  } catch (error) {
    return handleError(res, error);
  }
};

const findById = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }

  try {
    const pessoa = await pessoaRepository.findById(req.params.id);
    if (!pessoa) {
      return res.status(404).json({ error: 'Pessoa não encontrada.' });
    }
    return res.status(200).json(pessoa);
  } catch (error) {
    return handleError(res, error);
  }
};

const update = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }

  const result = normalizePessoa(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const pessoa = await pessoaRepository.update(req.params.id, result.pessoa);
    if (!pessoa) {
      return res.status(404).json({ error: 'Pessoa não encontrada.' });
    }
    return res.status(200).json(pessoa);
  } catch (error) {
    return handleError(res, error);
  }
};

const remove = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'O id deve ser um inteiro positivo válido.' });
  }

  try {
    const removed = await pessoaRepository.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Pessoa não encontrada.' });
    }
    return res.status(200).json({ message: 'Pessoa removida com sucesso.' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { create, findAll, findById, update, remove };