const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');

const router = express.Router();

const HTTP_OK_STATUS = 200;

router.get('/', async (_req, res) => {
  const path = './talker.json';
  const data = await fs.readFile(join(__dirname, path), 'utf-8');
  const talkers = JSON.parse(data);
  res.status(HTTP_OK_STATUS).json([...talkers]);
});

module.exports = router;