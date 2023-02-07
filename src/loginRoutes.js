const express = require('express');

const router = express.Router();

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 400;

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

const validateEmail = (email) => {
  if (!email) {
    const emailMessage = 'O campo "email" é obrigatório';
    return { validatedEmail: false, emailMessage };
  }
  const validateEmailFormat = email.toLowerCase()
    .match(/^\S+@\S+\.\S+$/);
  if (!validateEmailFormat) {
    const emailMessage = 'O "email" deve ter o formato "email@email.com"';
    return { validatedEmail: false, emailMessage };
  }
  return { validatedEmail: true };
};

const validatePassword = (password) => {
  if (!password) {
    const passwordMessage = 'O campo "password" é obrigatório';
    return { validatedPassword: false, passwordMessage };
  }
  if (password.length < 6) {
    const passwordMessage = 'O "password" deve ter pelo menos 6 caracteres';
    return { validatedPassword: false, passwordMessage };
  }
  return { validatedPassword: true };
};

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const { validatedEmail, emailMessage } = validateEmail(email);
  if (!validatedEmail) {
    return res.status(HTTP_NOT_FOUND).json({ message: emailMessage });
  }
  const { validatedPassword, passwordMessage } = validatePassword(password);
  if (!validatedPassword) {
    return res.status(HTTP_NOT_FOUND).json({ message: passwordMessage });
  }
  
  const token = generateToken();
  res.status(HTTP_OK_STATUS).json({ token });
});

module.exports = router;