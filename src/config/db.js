// db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
<<<<<<< HEAD
    database: 'or_lea',
=======
    database: 'dbpweb',
>>>>>>> zhahra
});

export default pool;