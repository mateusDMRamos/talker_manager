const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const path = './talker.json';
  const data = await fs.readFile(join(__dirname, path), 'utf-8');
  const talkers = JSON.parse(data);
  res.status(HTTP_OK_STATUS).json([...talkers]);
});

app.listen(PORT, () => {
  console.log('Online');
});
