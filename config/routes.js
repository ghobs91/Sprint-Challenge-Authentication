const axios = require("axios");
const bcrypt = require("bcryptjs");
const { authenticate } = require("./middlewares");
const jwtSecret = require("../_secrets/keys").jwtKey;
const db = require("../database/dbConfig");
const jwt = require("jsonwebtoken");

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

// jwt setup
function generateToken(user) {
  const jwtPayload = {
    ...user,
  };
   const jwtOptions = {
    expiresIn: '30m',
  };
  return jwt.sign(jwtPayload, jwtKey, jwtOptions);
}

function register(req, res) {
  // implement user registration
	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 15);
  credentials.password = hash;
  
	db("users")
		.insert(credentials)
		.then(ids => {
			const token = generateToken({ username: credentials.username });
			res.status(201).json({ ids: ids[0], token });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: "Could not create User" });
		});
}

function login(req, res) {
  // implement user login
	const credentials = req.body;
	db("users")
		.where({ username: credentials.username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(credentials.password, user.password)) {
				const token = generateToken(user);
				res.status(200).json({ welcome: user.username, token });
			} else {
				res
					.status(500)
					.json({ error: "Login failed" });
			}
		});
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
