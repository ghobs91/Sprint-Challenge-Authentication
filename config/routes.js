const axios = require('axios');
const bcrypt = require('bcryptjs');
const { authenticate } = require('./middlewares');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

// jwt setup
const jwtSecret = 'The mongoose flies at midnight';
function generateToken(user) {
const jwtPayload = {
  ...user,
};
const jwtOptions = {
  expiresIn: '1h',
};
  return jwt.sign(jwtPayload, jwtSecret, jwtOptions);
}

function register(req, res) {
  // implement user registration
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 10);
  credentials.password = hash;
   db('users')
    .insert(credentials)
    .then(ids => {
      res.status(201).json({ newUserId: ids[0] });
    })
    .catch(err => {
      if (err.errno === 19) {
        res.status(400).json({ error: 'Username taken.' });
      } else {
        res.status(500).json(err);
      }
    });
  /////
}

function login(req, res) {
  // implement user login
  const creds = req.body;
   db('users')
  .where({username: creds.username})
  .first()
  .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({ message: `User logged in: ${user.username}`, token });
      } else {
          res.status(401).json({ message: "You shall not pass!"});
      }
  })
  .catch(err => res.status(500).json({err}));
}

function getJokes(req, res) {
  axios
    .get(
      'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
