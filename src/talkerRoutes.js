const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');

const router = express.Router();

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;

const getTakers = async () => {
  const path = './talker.json';
  const data = await fs.readFile(join(__dirname, path), 'utf-8');
  return JSON.parse(data);
};

router.get('/', async (_req, res) => {
  const talkers = await getTakers();
  res.status(HTTP_OK_STATUS).json([...talkers]);
});

// const validateToken = (token) => {
//   if (typeof token !== 'string' || token.length < 16) return false;
//   return true;
// };

// router.post('/', async (req, res) => {
//   const validToken = validateToken(req.headers.authorization);
//   if (!validToken) return res.status(401).json({ message: 'Token inválido' });
//   const talkers = await getTakers();
// });

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