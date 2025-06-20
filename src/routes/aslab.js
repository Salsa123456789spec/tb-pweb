import express from "express";
const router = express.Router();



router.get("/dashboard", (req, res) => {
    res.render("aslab/layout/dashboard");
});





export default router;