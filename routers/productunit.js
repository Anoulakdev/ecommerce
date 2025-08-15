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

router.get("/productunits", list);

router.get("/productunits/:pUnitId", getById);

router.post("/productunits", create);

router.put("/productunits/:pUnitId", update);

router.delete("/productunits/:pUnitId", remove);

module.exports = router;
