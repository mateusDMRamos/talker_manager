const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');
const {
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
} = require('./middlewares/validationMiddlewares');

const router = express.Router();

const HTTP_OK_STATUS = 200;
const DELETE_OK_STATUS = 204;
const CREATED_OK_STATUS = 201;
const HTTP_NOT_FOUND = 404;
const dataArchive = './talker.json';

const getTakers = async () => {
  const path = dataArchive;
  const data = await fs.readFile(join(__dirname, path), 'utf-8');
  return JSON.parse(data);
};

router.get('/', async (_req, res) => {
  const talkers = await getTakers();
  res.status(HTTP_OK_STATUS).json([...talkers]);
});

router.get('/search',
  tokenValidation,
  async (req, res) => {
    const searchTerm = req.query.q;
    const talkers = await getTakers();
    if (searchTerm.length === 0) return res.status(HTTP_OK_STATUS).json(talkers);
    const searchedTalkers = talkers.filter((talker) => talker.name.includes(searchTerm));
    if (searchedTalkers.length === 0) return res.status(HTTP_OK_STATUS).json([]);

    res.status(HTTP_OK_STATUS).json(searchedTalkers);
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

router.post('/',
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation, 
  async (req, res) => {
    const newTalker = { ...req.body };
    const talkers = await getTakers();
    newTalker.id = talkers.length + 1;
    const newList = [...talkers, newTalker];
    const path = dataArchive;
    await fs.writeFile(join(__dirname, path), JSON.stringify(newList), 'utf-8');
    res.status(CREATED_OK_STATUS).json(newTalker);
});

router.put('/:id',
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation, 
  async (req, res) => {
    const editTalker = { ...req.body };
    const id = Number(req.params.id);
    const talkers = await getTakers();
    const filteredTalkers = talkers.filter((talker) => talker.id !== id);
    editTalker.id = id;
    const newList = [...filteredTalkers, editTalker];
    const path = dataArchive;
    await fs.writeFile(join(__dirname, path), JSON.stringify(newList), 'utf-8');
    res.status(HTTP_OK_STATUS).json(editTalker);
});

router.delete('/:id',
  tokenValidation,
  async (req, res) => {
    const id = Number(req.params.id);
    const talkers = await getTakers();
    const filteredTalkers = talkers.filter((talker) => talker.id !== id);
    const path = dataArchive;
    await fs.writeFile(join(__dirname, path), JSON.stringify(filteredTalkers), 'utf-8');
    res.status(DELETE_OK_STATUS).send();
});

module.exports = router;