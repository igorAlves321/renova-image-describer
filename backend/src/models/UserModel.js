import db from '../db.js';

export const createUser = (user, callback) => {
  db.query('INSERT INTO users SET ?', user, callback);
};

export const getUserByUsername = (username, callback) => {
  db.query('SELECT * FROM users WHERE username = ?', [username], callback);
};
