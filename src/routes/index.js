import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("mahasiswa/layout/index");
});

export default router;