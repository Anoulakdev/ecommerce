const express = require("express");
const router = express.Router();

// controllers
const {
  list,
  getById,
  create,
  update,
  remove,
} = require("../controllers/productunit");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/productunits", auth, list);

router.get("/productunits/:pUnitId", auth, getById);

router.post("/productunits", auth, create);

router.put("/productunits/:pUnitId", auth, update);

router.delete("/productunits/:pUnitId", auth, remove);

module.exports = router;
