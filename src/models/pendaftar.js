import db from './index.js'; // pastikan ini adalah koneksi MySQL-mu

const Pendaftar = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM pendaftaran', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  findByPk: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM pendaftaran WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  update: (data, where) => {
    const { nim, nama, no_hp } = data;
    const id = where.id;
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE pendaftaran SET nim = ?, nama = ?, no_hp = ? WHERE id = ?',
        [nim, nama, no_hp, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  destroy: (where) => {
    const id = where.id;
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM pendaftaran WHERE id = ?', [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};

export default Pendaftar;
