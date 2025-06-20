import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',        // sesuaikan password
  database: 'dbpweb'   // nama database kamu
});

db.connect((err) => {
  if (err) {
    console.error('Gagal koneksi ke database:', err);
  } else {
    console.log('Terkoneksi ke database');
  }
});

export default db;
