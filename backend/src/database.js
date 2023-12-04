import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'renova'
});

db.connect((err) => {
  if(err) {
    throw err;
  }
  console.log('Conexão com o MySQL estabelecida');
});

export default db;
