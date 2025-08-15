const express = require("express");
const router = express.Router();

// controllers
const {
  list,
  getById,
  create,
  update,
  remove,
} = require("../controllers/product");
// middleware
const { auth, checkRole } = require("../middleware/auth");

router.get("/products", auth, list);

router.get("/products/:productId", auth, getById);

router.post("/products", auth, create);

router.put("/products/:productId", auth, update);

router.delete("/products/:productId", auth, remove);

module.exports = router;
