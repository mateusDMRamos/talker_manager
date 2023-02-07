const TOKEN_ERROR_VALIDATION = 401;
const ERROR_VALIDATION = 400;

const tokenValidation = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(TOKEN_ERROR_VALIDATION).json({ message: 'Token não encontrado' });
  } 
  if (token.length !== 16) {
    return res.status(TOKEN_ERROR_VALIDATION).json({ message: 'Token inválido' });
  }
  next();
};

const nameValidation = (req, res, next) => {
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
};
const ageValidation = (req, res, next) => {
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
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(ERROR_VALIDATION).json({ message: 'O campo "talk" é obrigatório' });
  next();
};

const watchedAtValidation = (req, res, next) => {
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
};

const rateValidation = (req, res, next) => {
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
};

module.exports = {
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
};