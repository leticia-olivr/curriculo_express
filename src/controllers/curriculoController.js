const curriculoRepository = require('../models/curriculoRepository');

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

const findByPessoaId = async (req, res) => {
  const pessoaId = normalizeId(req.params.pessoaId);
  if (!pessoaId) {
    return res.status(400).json({ error: 'pessoaId deve ser um inteiro positivo válido.' });
  }

  try {
    const curriculo = await curriculoRepository.findByPessoaId(pessoaId);
    if (!curriculo) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    return res.status(200).json(curriculo);
  } catch (error) {
    console.error('Erro ao consultar currículo:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { findByPessoaId };