// middlewares/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Folder tujuan
const uploadDir = path.join('public', 'uploads');

// Buat folder jika belum ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// Middleware upload
const upload = multer({ storage });

export default upload;
