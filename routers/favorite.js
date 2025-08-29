const express = require("express");
const router = express.Router();

// controllers
const { list, getById, create } = require("../controllers/favorite");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/favorites", auth, list);

router.post("/favorites", auth, create);

module.exports = router;
