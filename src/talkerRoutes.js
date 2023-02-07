const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');

const router = express.Router();

const HTTP_OK_STATUS = 200;
const CREATED_OK_STATUS = 201;
const HTTP_NOT_FOUND = 404;
const TOKEN_ERROR_VALIDATION = 401;
const ERROR_VALIDATION = 400;

const getTakers = async () => {
  const path = './talker.json';
  const data = await fs.readFile(join(__dirname, path), 'utf-8');
  return JSON.parse(data);
};

router.get('/', async (_req, res) => {
  const talkers = await getTakers();
  res.status(HTTP_OK_STATUS).json([...talkers]);
});

router.post('/', (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(TOKEN_ERROR_VALIDATION).json({ message: 'Token não encontrado' });
  } 
  if (token.length !== 16) {
    return res.status(TOKEN_ERROR_VALIDATION).json({ message: 'Token inválido' });
  }
  next();
});

router.post('/', (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(ERROR_VALIDATION).json({ message: 'O campo "name" é obrigatório' });
  } 
  if (name.length < 3) {
    return res.status(ERROR_VALIDATION).json({ 
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  next();
});

router.post('/', (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(ERROR_VALIDATION).json({ message: 'O campo "age" é obrigatório' });
  if (typeof age !== 'number') {
    return res.status(ERROR_VALIDATION).json({ 
      message: 'O campo "age" deve ser do tipo "number"',
    });
}
  if (age % 1 !== 0) {
    return res.status(ERROR_VALIDATION).json({ 
      message: 'O campo "age" deve ser um "number" do tipo inteiro',
    });
  }
  if (age < 18) {
    return res.status(ERROR_VALIDATION).json({ 
      message: 'A pessoa palestrante deve ser maior de idade',
    });
  }
  next();
});

router.post('/', (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(ERROR_VALIDATION).json({ message: 'O campo "talk" é obrigatório' });
  next();
});

router.post('/', (req, res, next) => {
  const { watchedAt } = req.body.talk;
  if (!watchedAt) {
    return res.status(ERROR_VALIDATION).json({
      message: 'O campo "watchedAt" é obrigatório',
     });
  }
  const day = watchedAt.slice(0, 2);
  const month = watchedAt.slice(3, 5);
  const year = watchedAt.slice(6);
  const date = new Date(`${year}/${month}/${day}`);
  if ((date instanceof Date && !watchedAt.includes('/')) || watchedAt.length !== 10) {
    return res.status(ERROR_VALIDATION).json({ 
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
}
  next();
});

router.post('/', (req, res, next) => {
  const { rate } = req.body.talk;
  if (typeof rate !== 'number') {
    return res.status(ERROR_VALIDATION).json({
      message: 'O campo "rate" é obrigatório',
    });
  }
  if (rate % 1 !== 0 || rate > 5 || rate < 1) {
    return res.status(ERROR_VALIDATION).json({ 
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
}
  next();
});

router.post('/', async (req, res) => {
  const newTalker = { ...req.body };
  const talkers = await getTakers();
  newTalker.id = talkers.length + 1;
  const newList = [...talkers, newTalker];
  const path = './talker.json';
  await fs.writeFile(join(__dirname, path), JSON.stringify(newList), 'utf-8');
  res.status(CREATED_OK_STATUS).json(newTalker);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const talkers = await getTakers();
  const selectedTalker = talkers.find((talker) => talker.id === id);
  if (!selectedTalker) {
    return res.status(HTTP_NOT_FOUND).json({
      message: 'Pessoa palestrante não encontrada',
    });
  } 
  res.status(HTTP_OK_STATUS).json(selectedTalker);
});

module.exports = router;