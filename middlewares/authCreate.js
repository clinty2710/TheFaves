//middlewares/authCreate.js

// authCreate.js

const mysql = require('mysql');
const bcrypt = require('bcrypt');

const create = (user, callback) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Studman081!',
    database: 'thefavesdb'
  });

  connection.connect();

  const query = 'INSERT INTO users SET ?';

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return callback(err);

    const insert = {
      password: hash,
      email: user.email
    };

    connection.query(query, insert, (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback();
      callback(null);
    });
  });
};

module.exports = create;
