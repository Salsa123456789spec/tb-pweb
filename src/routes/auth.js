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
  const { identifier, password, role } = req.body;

  try {
    let user;
    
    // Cari user berdasarkan role dan identifier
    if (role === "mahasiswa") {
      user = await prisma.user.findFirst({
        where: { 
          nim: identifier,
          role: "mahasiswa"
        }
      });
    } else if (role === "asisten_lab") {
      user = await prisma.user.findFirst({
        where: { 
          no_aslab: identifier,
          role: "asisten_lab"
        }
      });
    } else if (role === "admin") {
      user = await prisma.user.findFirst({
        where: { 
          email: identifier,
          role: "admin"
        }
      });
    }

    if (!user) {
      req.flash('error_msg', 'Data tidak ditemukan atau role tidak sesuai');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash('error_msg', 'Password salah');
      return res.redirect('/login');
    }

    // Simpan data ke session
    req.session.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      nim: user.nim,
      no_aslab: user.no_aslab
    };

    // Tampilkan session di terminal
    console.log("Session user:", req.session.user);

    // Redirect berdasarkan role
    if (user.role === "asisten_lab") {
      res.redirect("/aslab/dashboard");
    } else if (user.role === "mahasiswa") {
      res.redirect("/mahasiswa/dashboard");
    } else if (user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/");
    }

  } catch (err) {
    console.error("Login error:", err);
    req.flash('error_msg', 'Terjadi kesalahan pada server');
    res.redirect('/login');
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/login");
  });
});

export default router;
