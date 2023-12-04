// Em controllers/userController.js
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';

export const register = (req, res) => {
  const password = bcrypt.hashSync(req.body.password, 10);
  const user = { username: req.body.username, password: password };
  UserModel.createUser(user, (err, result) => {
    if (err) throw err;
    res.send('Usuário registrado com sucesso!');
  });
};

export const login = (req, res) => {
  UserModel.getUserByUsername(req.body.username, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      if (bcrypt.compareSync(req.body.password, result[0].password)) {
        res.send('Login bem sucedido!');
      } else {
        res.send('Senha incorreta!');
      }
    } else {
      res.send('Usuário não encontrado!');
    }
  });
};
