import express from "express";
import bcrypt from "bcrypt";
import prisma from "../models/prisma.js"; // Pastikan ini path yang benar ke instance Prisma

const router = express.Router();

// Tampilkan halaman login tanpa layout
router.get("/login", (req, res) => {
  res.render("login", { layout: false });
});

// Proses login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (!user) {
      return res.send("Username tidak ditemukan");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Password salah");
    }

    // Simpan data ke session
    req.session.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      nim: user.nim
    };

    // Tampilkan session di terminal
    console.log("Session user:", req.session.user);

    // Redirect berdasarkan role
    if (user.role === "aslab") {
      res.redirect("/aslab/dashboard");
    } else {
      res.redirect("/mahasiswa/dashboard");
    }

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Terjadi kesalahan pada server.");
  }
});

export default router;
