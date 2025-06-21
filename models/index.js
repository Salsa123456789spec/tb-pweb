// // src/models/index.js (ESM version)
// import { Sequelize } from 'sequelize';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import UserModel from './user.js';

// const __filename = fileURLToPath(
//     import.meta.url);
// const __dirname = dirname(__filename);

// // Ganti sesuai konfigurasi databasenya
// const sequelize = new Sequelize('or_lea', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

// const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
// db.User = UserModel(sequelize, Sequelize);

// export default db;