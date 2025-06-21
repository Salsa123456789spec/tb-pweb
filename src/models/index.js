// // src/models/index.js
// import { Sequelize } from 'sequelize';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import UserModel from './user.js'; // pastikan file user.js juga ada

// const __filename = fileURLToPath(
//     import.meta.url);
// const __dirname = dirname(__filename);

// const sequelize = new Sequelize('or_lea', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

// const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
// db.User = UserModel(sequelize, Sequelize);

// export default db;