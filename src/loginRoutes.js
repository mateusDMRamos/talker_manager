const express = require('express');

const router = express.Router();

const HTTP_OK_STATUS = 200;

const generateToken = () => {
  const characters = 'qwertyuiopasdfghjklçzxcvbnmQWERTYUIOPASDFGHJKLÇZXCVBNM1234567890';
  let token = '';
  let counter = 0;
  while (counter < 16) {
    token += (characters[Math.floor(Math.random() * characters.length)]);
    counter += 1;
  }
  return token;
};

router.post('/', async (__req, res) => {
  const token = generateToken();
  res.status(HTTP_OK_STATUS).json({ token });
});

module.exports = router;