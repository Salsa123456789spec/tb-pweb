import express from "express";
import Pendaftar from '../models/pendaftar.js';

const router = express.Router();

/* ------------------------------------------------------------------
 * Halaman dashboard Aslab
 * GET /aslab/dashboard
 * ------------------------------------------------------------------ */
router.get("/dashboard", (req, res) => {
  res.render("aslab/layout/dashboard");          // views/aslab/layout/dashboard.ejs
});

/* ------------------------------------------------------------------
 * Halaman verifikasi (baru ditambah)
 * GET /aslab/verifikasi
 * ------------------------------------------------------------------ */
router.get("/verifikasi", (req, res) => {
  console.log("Menangani request ke /aslab/verifikasi");
  res.render("aslab/verifikasi");                 // views/aslab/verifikasi.ejs
});

/* ------------------------------------------------------------------
 * Daftar pendaftar
 * GET /aslab/
 * ------------------------------------------------------------------ */
router.get("/", async (req, res) => {
  try {
    const pendaftar = await Pendaftar.findAll();  // ORM bebas (Sequelize/Prisma)
    res.render("aslab/index", { pendaftar });     // views/aslab/index.ejs
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan saat mengambil data pendaftar.");
  }
});

/* ------------------------------------------------------------------
 * Form edit pendaftar
 * GET /aslab/edit/:id
 * ------------------------------------------------------------------ */
router.get("/edit/:id", async (req, res) => {
  try {
    const data = await Pendaftar.findByPk(req.params.id);
    if (!data) return res.status(404).send("Data tidak ditemukan.");
    res.render("aslab/edit", { data });           // views/aslab/edit.ejs
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan.");
  }
});

/* ------------------------------------------------------------------
 * Proses update pendaftar
 * POST /aslab/edit/:id
 * ------------------------------------------------------------------ */
router.post("/edit/:id", async (req, res) => {
  try {
    const { nim, nama, no_hp } = req.body;
    await Pendaftar.update({ nim, nama, no_hp }, { where: { id: req.params.id } });
    res.redirect("/aslab");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memperbarui data.");
  }
});

/* ------------------------------------------------------------------
 * Hapus pendaftar
 * GET /aslab/delete/:id
 * ------------------------------------------------------------------ */
router.get("/delete/:id", async (req, res) => {
  try {
    await Pendaftar.destroy({ where: { id: req.params.id } });
    res.redirect("/aslab");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus data.");
  }
});

export default router;
